import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Categories, CategoriesByInterests } from '../../../../models';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { CitiesByCountriesInterface, CitiesInterface, CountriesInterface, InterestsInterface, InterestsByCitiesInterface, LanguagesInterface, LanguageTranslationInterface, CategoryInterface } from '../../../../interfaces';
import { useEffect, useState } from 'react';
import { ML } from '../../../../globals';
import { BreadCrumbs, Login, SelectLanguage, Main, SelectCategory } from '../../../../components';

export const getStaticPaths: GetStaticPaths = async () => {
	const listCountries = await Countries.getAll();
	const listCities = await Cities.getAll();
	const listCitiesByCountries = await CitiesByCountries.getAll();
	const listInterests = await Interests.getAll();
	const listInterestsByCities = await InterestsByCities.getAll();
	const listLanguages = await Languages.getAll();

	const paths: string[] = [];

	if (listCountries.data.length && listCities.data.length && listCitiesByCountries.data.length && listInterests.data.length && listInterestsByCities.data.length && listLanguages.data.length) {
		listInterestsByCities.data.forEach((interestByCity: InterestsByCitiesInterface.InterestsByCity) => {
			let interestRoute: string | null = null;
			let cityRoute: string | null = null;
			listInterests.data.forEach((interest: InterestsInterface.Interest) => {
				if (interestByCity.idInterest === interest.id) {
					interestRoute = interest.route;
					
					listCities.data.forEach((city: CitiesInterface.City) => {
						if (interestByCity.idCity === city.id) {
							cityRoute = city.route;
							listCitiesByCountries.data.forEach((cityByCountry: CitiesByCountriesInterface.CityByCountries) => {
								if (cityByCountry.idCity === city.id) {

									listCountries.data.forEach((country: CountriesInterface.Country) => {
										listLanguages.data.forEach((language: LanguagesInterface.Languages) => {
											let countryRoute = '';
											if (country.id === language.idCountry) {
												countryRoute = '/' + country.route;
											} else {
												countryRoute = '/' + country.route + '-' + language.route;
											}
						
											if (country.id === cityByCountry.idCountry) {
												const url = countryRoute + '/' + cityRoute + '/' + interestRoute;
												if (!paths.includes(url)) paths.push(url);
											}
										});
									});
								}
							});
						}
					});
				}
			});
		});
	}
	
	return {
		paths,
		fallback: false
	};
};

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext<ParsedUrlQuery>) => {
	if (!params) {
		return {
			notFound: true
		};
	}

	const country = await Countries.getByRoute((params.countries as string).slice(0, 2));
	const categoriesData = await Categories.getAll();
	const interestData = await Interests.getAllByRouteInterest(params.interests as string);
	const categoriesByInterestsData = await CategoriesByInterests.getAllByIdInterest(interestData.data[0].id);
	const languagesDb = await Languages.getAll();
	const text = await ML.getTranslationText();

	if (!categoriesData.data.length || !interestData.data.length || !categoriesByInterestsData.data.length || !text || !languagesDb.data.length) return {props: {}};
	
	const idCategories: number[] = [];
	for (let index = 0; index < categoriesByInterestsData.data.length; index++) {
		idCategories.push(categoriesByInterestsData.data[index].idCategory);
	}
	
	const listCategories = categoriesData.data.filter((category: CategoryInterface.Category) => idCategories.includes(category.id));

	const listLanguages: string[] = languagesDb.data;

	return {
		props: {
			listCategories,
			listLanguages,
			text,
			country: country.data[0]
		}
	};
};

export default function InterestsPage({ listCategories, listLanguages, text, country, ...props }: InterestsPageProps): JSX.Element {
	const router = useRouter();
	const routerQuery = router.query as {[key:string]: string};
	
	const [textTranslation, setTextTranslation] = useState({});
	
	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text, null)
		setTextTranslation(currentTranslationText);
	}
	
	useEffect(() => {
		ML.setLanguageByPath(router.query.countries as string, listLanguages, country);
		updateLanguage();
	}, []);

	return (
		<Main>
			<Login/>
			<BreadCrumbs currentRoute={routerQuery} text={textTranslation} />
			page interest
			<SelectCategory listCategories={listCategories}  text={textTranslation}></SelectCategory>
			<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()} country={country}></SelectLanguage>
		</Main>
	)
}

interface InterestsPageProps {
	listCategories: CategoryInterface.Category[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.Translation[];
	country: CountriesInterface.Country;
}