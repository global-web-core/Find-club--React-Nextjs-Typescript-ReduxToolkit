import { Main, Button, PublicMeetings } from '../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Languages, Meetings, Interests, Categories } from '../../models';
import { useRouter } from 'next/router';
import { CitiesInterface, CountriesInterface, CountriesPageInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../../typesAndInterfaces/interfaces';
import { ParsedUrlQuery } from 'querystring';
import { Constants, Helpers, ML } from '../../globals';
import { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { DesiresSlice, MeetingsSlice, PaginationSlice, UserSlice } from '../../store/slices';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Layout } from '../../layout/Layout';
import { useSession } from 'next-auth/react';
import styles from '../../styles/Countries.module.css'
import { TypeLanguages } from '../../typesAndInterfaces/types';

export const getStaticPaths: GetStaticPaths = async () => {
	const countriesData = await Countries.getAll();
	const languagesData = await Languages.getAll();

	const paths: string[] = [];
	countriesData?.data?.forEach((country: CountriesInterface.Db) => {
		languagesData?.data?.forEach((language: LanguagesInterface.Db) => {
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
	
	if (typeof params.countries === 'string') {
		const countryDb = await Countries.getByRoute((params.countries).slice(0, 2));
		const country = countryDb?.data?.[0];
		const citiesCountry = country && await CitiesByCountries.getAllByCountry(country.id);
		
		const idCities = citiesCountry?.data?.map((city: CitiesByCountriesInterface.Db) => city.idCity);
		const citiesData = await Cities.getAll();
		
		const listCities = citiesData?.data?.filter((city: CitiesInterface.Db) => idCities?.includes(city.id));

		const countriesDb = await Countries.getAll();
		const listCountries = countriesDb.data;

		const interestsDb = await Interests.getAll();
		const listInterests = interestsDb.data;

		const categoriesDb = await Categories.getAll();
		const listCategories = categoriesDb.data;

		const languagesDb = await Languages.getAll();
		const listLanguages = languagesDb.data

		let textTranslation;
		let lang;
		let language: LanguagesInterface.Db | undefined;
		const pathLanguage = params.countries;
		if (typeof pathLanguage === 'string' && listLanguages && country) {
			const languageByPath: TypeLanguages = ML.getLanguageByPath(pathLanguage, listLanguages, country);
			language = listLanguages.find(lang => lang.route === languageByPath)
			lang = languageByPath;
			textTranslation = await ML.getTranslationText(languageByPath);
		}
		
		let metadata;
		if (typeof pathLanguage === 'string' && lang && textTranslation) metadata = generateMetadata(textTranslation, pathLanguage, lang);
		
		if (!listCities || !listLanguages || !listCountries || !listInterests || !listCategories || !textTranslation || !country || !language || !metadata) return {props: {}};

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
	}
	
	return {props: {}}
};

export function generateMetadata(text: LanguageTranslationInterface.Txt, pathCountries: string, lang: string):MetadataInterface.Main {
	const getTextForTitle = () => {
		const country = pathCountries?.length ? text[pathCountries.slice(0, 2)] + ' ' : '';
		const mainText = text[ML.key.titleCountries];
		const title = country + mainText;
		return title;
	}

	const getTextForDescription = () => {
		const country = pathCountries?.length ? text[pathCountries.slice(0, 2)] + ' ' : '';
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

export default function CountriesPage({ listCities, listLanguages, listCountries, listInterests, listCategories, textTranslation, country, language, metadata }: CountriesPageInterface.Props): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, Constants.namePagination.meetingsList));

	const clearDataMeetings = () => {
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
		dispatch(PaginationSlice.clearAll());
	}

	const getMeetingsFromDb = async (startDate: string, endDate: string) => {
		let listMeetings;
		
		const meetingsDb = await Meetings.getPageByDateMeetingsAndCountry(country.id, language.id, startDate, endDate, currentPagination?.currentPage);

		const countMeetingsDb = await Meetings.getCountByDateMeetingAndCountry(country.id, language.id, startDate, endDate);
		
		let countMeetings: number | undefined;
		if (countMeetingsDb?.data?.[0]?.countRowsSqlRequest) countMeetings = Helpers.calculateCountPageByCountRows(parseInt(countMeetingsDb?.data?.[0]?.countRowsSqlRequest));

		if (meetingsDb?.data?.length === 0 || meetingsDb?.data === undefined || !countMeetings) return [];

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