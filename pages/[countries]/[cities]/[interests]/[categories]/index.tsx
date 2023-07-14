import { SelectLanguage, Main, Alert } from '../../../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Categories, CategoriesByInterests } from '../../../../../models';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { CitiesByCountriesInterface, CitiesInterface, CountriesInterface, InterestsInterface, InterestsByCitiesInterface, LanguagesInterface, LanguageTranslationInterface, CategoryInterface, CategoriesByInterestsInterface, MetadataInterface } from '../../../../../interfaces';
import { ReactElement, useEffect } from 'react';
import { ML } from '../../../../../globals';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../../../../store/hook';
import { TextTranslationSlice } from '../../../../../store/slices';
import { Layout } from '../../../../../layout/Layout';

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

	const countryDb = await Countries.getByRoute((params.countries as string).slice(0, 2) as string);
	const country = countryDb.data[0];

	const languagesDb = await Languages.getAll();

	if (!languagesDb.data.length || !countryDb.data.length) return {props: {}};

	const listLanguages = languagesDb.data;

	let text = {};
	let lang;
	const pathLanguage = params.countries;
	if (typeof pathLanguage === 'string') {
		const languageByPath = ML.getLanguageByPath(pathLanguage, listLanguages, country);
		lang = languageByPath;
		const textDb = await ML.getTranslationText(languageByPath);
		if (textDb) text = textDb
		if (!textDb || !languageByPath) return {props: {}};
	}

	let metadata;
	const pathInterest = params.categories;
	if (typeof pathInterest === 'string' && lang) metadata = generateMetadata(text, pathInterest, lang);

	return {
		props: {
			listLanguages,
			text,
			country,
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.TextTranslation, pathInterest: string, lang: string):MetadataInterface.Main {
	const getTextForTitle = () => {
		const interest = pathInterest?.length ? text[pathInterest as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.titleInterests];
		const title = interest + mainText;
		return title;
	}

	const getTextForDescription = () => {
		const interest = pathInterest?.length ? text[pathInterest as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.descriptionInterests];
		const description = interest + mainText;
		return description;
	}

	return {
		title: getTextForTitle(),
		description: getTextForDescription(),
		lang
	}
}

export default function CategoriesPage({ listLanguages, text, country, metadata }: CategoriesPageProps): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();
	
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	
	const updateLanguage = async () => {
		const currentTranslationText = await ML.getChangeTranslationText(text)
		dispatch(TextTranslationSlice.updateLanguageAsync(currentTranslationText))
	}
	
	useEffect(() => {
		ML.setLanguageByPath(router.query.countries as string, listLanguages, country);
		updateLanguage();
	}, []);

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
			</Head>
			<Main>
				page categories
				<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()} country={country}></SelectLanguage>
				<Alert/>
			</Main>
		</>
	)
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

interface CategoriesPageProps {
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.TextTranslation;
	country: CountriesInterface.Country;
	metadata: MetadataInterface.Main;
}