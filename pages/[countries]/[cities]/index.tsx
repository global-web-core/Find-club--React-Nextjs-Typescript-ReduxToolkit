import { Alert, Button, PublicMeetings, SelectInterest, SelectLanguage } from '../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Meetings, Categories } from '../../../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { Constants, Helpers, ML } from '../../../globals';
import { ReactElement, useEffect } from 'react';
import { Main } from '../../../components';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { DesiresSlice, MeetingsSlice, PaginationSlice, TextTranslationSlice, UserSlice } from '../../../store/slices';
import { Layout } from '../../../layout/Layout';
import { useSession } from 'next-auth/react';

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

	const countriesDb = await Countries.getAll();
	const listCountries = countriesDb.data;

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

	const categoriesDb = await Categories.getAll();
	const listCategories = categoriesDb.data;

	const listCities = cityData.data;

	let textTranslation = {};
	let lang;
	const pathLanguage = params.countries;
	if (typeof pathLanguage === 'string') {
		const languageByPath = ML.getLanguageByPath(pathLanguage, listLanguages, country);
		lang = languageByPath;
		const textDb = await ML.getTranslationText(languageByPath);
		if (textDb) textTranslation = textDb
		if (!textDb || !languageByPath) return {props: {}};
	}

	let metadata;
	const pathCity = params.cities;
	if (typeof pathCity === 'string' && lang) metadata = generateMetadata(textTranslation, pathCity, lang);

	return {
		props: {
			listCountries,
			listInterests,
			listLanguages,
			listCategories,
			listCities,
			textTranslation,
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

export default function CitiesPage({ listCountries, listCities, listInterests, listCategories, listLanguages, textTranslation, country, metadata }: CitiesPageProps): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, Constants.namePagination.meetingsList));

	const clearDataMeetings = () => {
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
		dispatch(PaginationSlice.clearAll());
	}

	const getMeetingsFromDb = async (startDate, endDate) => {
		let listMeetings;

		const meetingsDb = await Meetings.getPageByDateMeetingsAndCountry(country.id, startDate, endDate, currentPagination?.currentPage);
		if (meetingsDb.data.length === 0) return [];

		const countMeetingsDb = await Meetings.getCountByDateMeetingAndCountry(country.id, startDate, endDate);
		const countMeetings = Helpers.calculateCountPageByCountRows(parseInt(countMeetingsDb?.data[0]?.countRowsSqlRequest));

		if (meetingsDb.data.length > 0 && countMeetings > 0) {
			listMeetings = meetingsDb.data;
			if (!currentPagination) {
				dispatch(PaginationSlice.setPagination({maxPage: countMeetings, namePagination: Constants.namePagination.meetingsList}));
			}
			if (currentPagination?.maxPage !== countMeetings) {
				dispatch(PaginationSlice.setPagination({maxPage: countMeetings, namePagination: Constants.namePagination.meetingsList}));
			}
		} else {
			clearDataMeetings();
		}
		return listMeetings;
	}


	useEffect(() => {
		dispatch(UserSlice.getIdUserAsync(session));
	}, [session, status]);

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
			</Head>
			<Main>
				<PublicMeetings
					listCountries={listCountries}
					listLanguages={listLanguages}
					country={country}
					textTranslation={textTranslation}
					metadata={metadata}
					listCities={listCities}
					listInterests={listInterests}
					listCategories={listCategories}
					getMeetingsFromDb={(startDate, endDate) => getMeetingsFromDb(startDate, endDate)}
					clearDataMeetings={clearDataMeetings}
				/>
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
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