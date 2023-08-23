import { SelectCity, Main, Loading, DivWithTopPanel, ButtonList, MeetingsList, Pagination, Button, CalendarMeetings,FilterMeetings, BlockMeetings, NavigationMeetings, PublicMeetings } from '../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Languages, Desires, Meetings, Interests, Categories } from '../../models';
import { useRouter } from 'next/router';
import { CitiesInterface, CountriesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { Constants, Helpers, ML } from '../../globals';
import { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import { DesiresSlice, MeetingsSlice, PaginationSlice, SelectFilterSlice, TextTranslationSlice, UserSlice, CalendarMeetingsSlice } from '../../store/slices';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Layout } from '../../layout/Layout';
import Calendar from 'react-calendar'
import cn from 'classnames';
import { useSession, signIn } from 'next-auth/react';
import styles from '../../styles/Countries.module.css'

export const getStaticPaths: GetStaticPaths = async () => {
	const countriesData = await Countries.getAll();
	const languagesData = await Languages.getAll();

	const paths: string[] = [];
	countriesData.data.forEach((country: CountriesInterface.Db) => {
		languagesData.data.forEach((language: LanguagesInterface.Db) => {
			let url = '';
			if (country.id === language.idCountry) {
				url = '/' + country.route;
			} else {
				url = '/' + country.route + '-' + language.route;
			}
			if (!paths.includes(url)) paths.push(url);
		});
	});
	
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
	if (!countryDb.data.length) return {props: {}};
	const country = countryDb.data[0];
	const citiesCountry = await CitiesByCountries.getAllByCountry(country.id);
	
	if (!citiesCountry.data.length) return {props: {}};
	const idCities = citiesCountry.data.map((city: CitiesByCountriesInterface.Db) => city.idCity);
	const citiesData = await Cities.getAll();
	
	if (!idCities.length || !citiesData.data.length) return {props: {}};
	const listCities = citiesData.data.filter((city: CitiesInterface.Db) => idCities.includes(city.id));

	const countriesDb = await Countries.getAll();
	const listCountries = countriesDb.data;

	const interestsDb = await Interests.getAll();
	const listInterests = interestsDb.data;

	const categoriesDb = await Categories.getAll();
	const listCategories = categoriesDb.data;

	let listLanguages = [];
	const languagesDb = await Languages.getAll();
	if (languagesDb) listLanguages = languagesDb.data
	if (!languagesDb.data.length) return {props: {}};

	let textTranslation = {};
	let lang;
	let language;
	const pathLanguage = params.countries;
	if (typeof pathLanguage === 'string') {
		const languageByPath = ML.getLanguageByPath(pathLanguage, listLanguages, country);
		language = listLanguages.find(lang => lang.route === languageByPath)
		lang = languageByPath;
		const textDb = await ML.getTranslationText(languageByPath);
		if (textDb) textTranslation = textDb
		if (!textDb || !languageByPath) return {props: {}};
	}
	
	let metadata;
	if (typeof pathLanguage === 'string' && lang) metadata = generateMetadata(textTranslation, pathLanguage, lang);

	return {
		props: {
			listCities,
			listLanguages,
			listCountries,
			listInterests,
			listCategories,
			textTranslation,
			country,
			language,
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.Txt, pathCountries: string, lang: string):MetadataInterface.Main {
	const getTextForTitle = () => {
		const country = pathCountries?.length ? text[pathCountries.slice(0, 2) as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.titleCountries];
		const title = country + mainText;
		return title;
	}

	const getTextForDescription = () => {
		const country = pathCountries?.length ? text[pathCountries.slice(0, 2) as keyof typeof text] + ' ' : '';
		const mainText = text[ML.key.descriptionCountries];
		const description = country + mainText;
		return description;
	}

	return {
		title: getTextForTitle(),
		description: getTextForDescription(),
		lang
	}
}

export default function CountriesPage({ listCities, listLanguages, listCountries, listInterests, listCategories, textTranslation, country, language, metadata }: CountriesPageProps): JSX.Element {
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
		
		const meetingsDb = await Meetings.getPageByDateMeetingsAndCountry(country.id, language.id, startDate, endDate, currentPagination?.currentPage);
		if (meetingsDb.data.length === 0) return [];

		const countMeetingsDb = await Meetings.getCountByDateMeetingAndCountry(country.id, language.id, startDate, endDate);
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
		if (session?.user?.email && session?.user?.image && session?.user?.name) dispatch(UserSlice.getIdUserAsync({email: session?.user?.email, image: session?.user?.image, name: session?.user?.name, textTranslation}));
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
					language={language}
				/>
				<Button name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Button  name={textTranslation[ML.key.yourMeetings]} onClick={() => {router.push({pathname: '/your-meetings'})}} />
			</Main>
		</>
	)
}

CountriesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

interface CountriesPageProps {
	listCities: CitiesInterface.Db[];
	listLanguages: LanguagesInterface.Db[];
	text: LanguageTranslationInterface.Txt;
	country: CountriesInterface.Db;
	metadata: MetadataInterface.Main;
}