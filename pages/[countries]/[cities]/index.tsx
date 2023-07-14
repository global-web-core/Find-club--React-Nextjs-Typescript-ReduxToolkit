import { Alert, SelectInterest, SelectLanguage } from '../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages } from '../../../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { ML } from '../../../globals';
import { ReactElement, useEffect } from 'react';
import { Main } from '../../../components';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { TextTranslationSlice } from '../../../store/slices';
import { Layout } from '../../../layout/Layout';

export const getStaticPaths: GetStaticPaths = async () => {
	const listCountries = await Countries.getAll();
	const listCities = await Cities.getAll();
	const listCitiesByCountries = await CitiesByCountries.getAll();
	const listLanguages = await Languages.getAll();

	const paths: string[] = [];

	if (listCountries.data.length && listCities.data.length && listCitiesByCountries.data.length && listLanguages.data.length) {
		listCitiesByCountries.data.forEach((cityByCountry: CitiesByCountriesInterface.CityByCountries) => {
			listCountries.data.forEach((country: CountriesInterface.Country) => {
				listLanguages.data.forEach((language: LanguagesInterface.Languages) => {
					let countryRoute = '';
					if (country.id === language.idCountry) {
						countryRoute = '/' + country.route;
					} else {
						countryRoute = '/' + country.route + '-' + language.route;
					}

					if (country.id === cityByCountry.idCountry) {
						const cityRoute = listCities.data.find((city: CitiesInterface.City) => city.id === cityByCountry.idCity);
						if (!country && !cityRoute) return {paths: [], fallback: false};
						const url = countryRoute + '/' + cityRoute.route;
						paths.push(url);
					}
				});
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

	const cityData = await Cities.getAllByRouteCity(params.cities as string);
	const interestsData = await Interests.getAll();
	const interestsByCitiesData = await InterestsByCities.getAll();
	if (!country || !cityData.data.length || !interestsData.data.length || !interestsByCitiesData.data.length || !countryDb.data.length) return {props: {}};

	const idInterests: number[] = [];
	for (let index = 0; index < interestsByCitiesData.data.length; index++) {
		if (interestsByCitiesData.data[index].idCity === cityData.data[0].id) idInterests.push(interestsByCitiesData.data[index].idInterest);
	}

	const listInterests: InterestsInterface.Interest[] = interestsData.data.filter((interest: InterestsInterface.Interest) => idInterests.includes(interest.id));
	
	let listLanguages = [];
	const languagesDb = await Languages.getAll();
	if (languagesDb) listLanguages = languagesDb.data

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
	const pathCity = params.cities;
	if (typeof pathCity === 'string' && lang) metadata = generateMetadata(text, pathCity, lang);

	return {
		props: {
			listInterests,
			listLanguages,
			text,
			country,
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.TextTranslation, pathCity: string, lang: string):MetadataInterface.Main {
	const getTextForTitle = () => {
		const city = pathCity?.length ? text[pathCity as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.titleCities];
		const title = city + mainText;
		return title;
	}

	const getTextForDescription = () => {
		const city = pathCity?.length ? text[pathCity as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.descriptionCities];
		const description = city + mainText;
		return description;
	}

	return {
		title: getTextForTitle(),
		description: getTextForDescription(),
		lang
	}
}

export default function CitiesPage({ listInterests, listLanguages, text, country, metadata }: CitiesPageProps): JSX.Element {
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
				<SelectInterest  listInterests={listInterests} text={textTranslation}></SelectInterest>
				<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()} country={country}></SelectLanguage>
				<Alert/>
			</Main>
		</>
	)
}

CitiesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

interface CitiesPageProps {
	listInterests: InterestsInterface.Interest[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.TextTranslation;
	country: CountriesInterface.Country;
	metadata: MetadataInterface.Main;
}