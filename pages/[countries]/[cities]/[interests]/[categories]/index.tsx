import { BreadCrumbs, SelectLanguage, Main, Login } from '../../../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Categories, CategoriesByInterests } from '../../../../../models';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { CitiesByCountriesInterface, CitiesInterface, CountriesInterface, InterestsInterface, InterestsByCitiesInterface, LanguagesInterface, LanguageTranslationInterface, CategoryInterface, CategoriesByInterestsInterface } from '../../../../../interfaces';
import { useEffect, useState } from 'react';
import { ML } from '../../../../../globals';

export const getStaticPaths: GetStaticPaths = async () => {
	const listCountries = await Countries.getAll();
	const listCities = await Cities.getAll();
	const listCitiesByCountries = await CitiesByCountries.getAll();
	const listInterests = await Interests.getAll();
	const listInterestsByCities = await InterestsByCities.getAll();
	const listCategories = await Categories.getAll();
	const listCategoriesByInterests = await CategoriesByInterests.getAll();
	const listLanguages = await Languages.getAll();

	const paths: string[] = [];

	if (listCountries.data.length && listCities.data.length && listCitiesByCountries.data.length && listInterests.data.length && listInterestsByCities.data.length && listCategories.data.length && listCategoriesByInterests.data.length && listLanguages.data.length) {
		listCategoriesByInterests.data.forEach((categoryByInterest: CategoriesByInterestsInterface.CategoryByInterest) => {
			let categoryRoute: string | null = null;
			listCategories.data.forEach((category: CategoryInterface.Category) => {
				if (categoryByInterest.idCategory === category.id) {
					listInterestsByCities.data.forEach((interestByCity: InterestsByCitiesInterface.InterestsByCity) => {
						let interestRoute: string | null = null;
						let cityRoute: string | null = null;
						listInterests.data.forEach((interest: InterestsInterface.Interest) => {
							if (interestByCity.idInterest === interest.id && categoryByInterest.idInterest === interest.id) {
									categoryRoute = category.route;
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
																const url = countryRoute + '/' + cityRoute + '/' + interestRoute + '/' + categoryRoute;
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
	const languagesDb = await Languages.getAll();
	const text = await ML.getTranslationText();

	if (!text || !languagesDb.data.length || !country.data.length) return {props: {}};

	const listLanguages: string[] = languagesDb.data;

	return {
		props: {
			listLanguages,
			text,
			country: country.data[0]
		}
	};
};

export default function InterestsPage({ listLanguages, text, country }: CategoriesPageProps): JSX.Element {
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
			page categories
			<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()} country={country}></SelectLanguage>
		</Main>
	)
}

interface CategoriesPageProps {
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.Translation[];
	country: CountriesInterface.Country;
}