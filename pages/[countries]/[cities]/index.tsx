import { Button, PublicMeetings } from '../../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Interests, InterestsByCities, Languages, Meetings, Categories } from '../../../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface, CitiesPageInterface } from '../../../typesAndInterfaces/interfaces';
import { ParsedUrlQuery } from 'querystring';
import { Constants, Helpers, ML } from '../../../globals';
import { ReactElement, useEffect } from 'react';
import { Main } from '../../../components';
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { DesiresSlice, MeetingsSlice, PaginationSlice, UserSlice } from '../../../store/slices';
import { Layout } from '../../../layout/Layout';
import { useSession } from 'next-auth/react';

export const getStaticPaths: GetStaticPaths = async () => {
	const listCountries = await Countries.getAll();
	const listCities = await Cities.getAll();
	const listCitiesByCountries = await CitiesByCountries.getAll();
	const listLanguages = await Languages.getAll();

	const paths: string[] = [];

	if (listCountries?.data?.length && listCities?.data?.length && listCitiesByCountries?.data?.length && listLanguages?.data?.length) {
		listCitiesByCountries.data.forEach((cityByCountry: CitiesByCountriesInterface.Db) => {
			listCountries?.data?.forEach((country: CountriesInterface.Db) => {
				listLanguages?.data?.forEach((language: LanguagesInterface.Db) => {
					let countryRoute = '';
					if (country.id === language.idCountry) {
						countryRoute = '/' + country.route;
					} else {
						countryRoute = '/' + country.route + '-' + language.route;
					}

					if (country.id === cityByCountry.idCountry) {
						const cityRoute = listCities?.data?.find((city: CitiesInterface.Db) => city.id === cityByCountry.idCity);
						if (!country && !cityRoute) return {paths: [], fallback: false};
						const url = countryRoute + '/' + cityRoute?.route;
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
	const country = countryDb?.data?.[0];
	const citiesByCountry = country && (await CitiesByCountries.getAllByCountry(country.id)).data
	const citiesByRoute = (await Cities.getAllByRouteCity(params.cities as string)).data
	let cityData: CitiesInterface.Db[] = [];
	if (citiesByCountry && citiesByRoute) {
		for (const cityByCountry of citiesByCountry) {
			for (const cityByRoute of citiesByRoute) {
				if (cityByRoute.id === cityByCountry.idCity) {
					cityData.push(cityByRoute);
					break;
				}
			}
		}
	}
	const city = cityData[0];

	const interestsData = await Interests.getAll();
	const interestsByCitiesData = await InterestsByCities.getAll();
	if (!country || !cityData.length || !interestsData?.data?.length || !interestsByCitiesData?.data?.length || !countryDb?.data?.length) return {props: {}};

	const idInterests: number[] = [];
	for (let index = 0; index < interestsByCitiesData.data.length; index++) {
		if (interestsByCitiesData.data[index].idCity === cityData[0].id) idInterests.push(interestsByCitiesData.data[index].idInterest);
	}

	const listInterests: InterestsInterface.Db[] = interestsData.data.filter((interest: InterestsInterface.Db) => idInterests.includes(interest.id));
	
	let listLanguages: LanguagesInterface.Db[] = [];
	const languagesDb = await Languages.getAll();
	if (languagesDb.data) listLanguages = languagesDb.data

	const categoriesDb = await Categories.getAll();
	const listCategories = categoriesDb.data;

	const listCities = cityData;

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
			city,
			language,
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.Txt, pathCity: string, lang: string):MetadataInterface.Main {
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

export default function CitiesPage({ listCountries, listCities, listInterests, listCategories, listLanguages, textTranslation, country, city, language, metadata }: CitiesPageInterface.Props): JSX.Element {
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

		const meetingsDb = await Meetings.getPageByDateMeetingsAndCity(country.id, city.id, language.id, startDate, endDate, currentPagination?.currentPage);

		const countMeetingsDb = await Meetings.getCountByDateMeetingAndCity(country.id, city.id, language.id, startDate, endDate);
		let countMeetings: number | undefined;
		if (countMeetingsDb?.data?.[0]?.countRowsSqlRequest) countMeetings = Helpers.calculateCountPageByCountRows(parseInt(countMeetingsDb?.data[0]?.countRowsSqlRequest));

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

CitiesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}