import { SelectCity, Main, Loading, DivWithTopPanel, ButtonList, MeetingsList, Pagination, Button } from '../../components';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { Cities, Countries, CitiesByCountries, Languages, Desires, Meetings, Interests, Categories } from '../../models';
import { useRouter } from 'next/router';
import { CitiesInterface, CountriesInterface, CitiesByCountriesInterface, LanguagesInterface, LanguageTranslationInterface, MetadataInterface } from '../../interfaces';
import { ParsedUrlQuery } from 'querystring';
import { Constants, Helpers, ML } from '../../globals';
import { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import { DesiresSlice, MeetingsSlice, PaginationSlice, SelectFilterSlice, TextTranslationSlice, UserSlice } from '../../store/slices';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Layout } from '../../layout/Layout';
import Calendar from 'react-calendar'
import cn from 'classnames';
import { useSession, signIn } from 'next-auth/react';

export const getStaticPaths: GetStaticPaths = async () => {
	const countriesData = await Countries.getAll();
	const languagesData = await Languages.getAll();

	const paths: string[] = [];
	countriesData.data.forEach((country: CountriesInterface.Country) => {
		languagesData.data.forEach((language: LanguagesInterface.Languages) => {
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
	const idCities = citiesCountry.data.map((city: CitiesByCountriesInterface.CityByCountries) => city.idCity);
	const citiesData = await Cities.getAll();
	
	if (!idCities.length || !citiesData.data.length) return {props: {}};
	const listCities = citiesData.data.filter((city: CitiesInterface.City) => idCities.includes(city.id));

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
	const pathLanguage = params.countries;
	if (typeof pathLanguage === 'string') {
		const languageByPath = ML.getLanguageByPath(pathLanguage, listLanguages, country);
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
			metadata
		}
	};
};

export function generateMetadata(text: LanguageTranslationInterface.TextTranslation, pathCountries: string, lang: string):MetadataInterface.Main {
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

export default function CountriesPage({ listCities, listLanguages, listCountries, listInterests, listCategories, textTranslation, country, metadata }: CountriesPageProps): JSX.Element {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);
	
	const listIdMeetings = useAppSelector(state => MeetingsSlice.listIdMeetingsSelect(state));
	const idUser = useAppSelector(state => UserSlice.userSelect(state));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, Constants.namePagination.meetingsList));
	const [activeStartDateChange, setActiveStartDateChange] = useState(null);
	const [selectedDay, setSelectedDay] = useState(null);
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));

	const maxDate = Helpers.increaseDateByMonths(new Date(), 3);
	const [nameMonth, setNameMonth] = useState(textTranslation[ML.key.month]);
	const [nameDay, setNameDay] = useState(textTranslation[ML.key.day]);


	const clearDataMeetings = () => {
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
		dispatch(PaginationSlice.clearAll());
	}

	const clearDataUsers = () => {
		dispatch(UserSlice.clearAll());
	}

	const clearData = () => {
		clearDataUsers();
		clearDataMeetings();
	}

	const getListMeetingsDb = async () => {
		let listMeetings;

		if (selectFilter.basic === Constants.nameBasicFilter.month) {
			const newDate = new Date();
			let currentDate;
			if (activeStartDateChange) {
				if (activeStartDateChange?.activeStartDate > newDate) {
					currentDate = activeStartDateChange?.activeStartDate;
				} else {
					currentDate = newDate;
				}
			} else {
				currentDate = newDate;
			}

			const startToday = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(currentDate));
			const endMonth = Helpers.getEndMonthByDate(currentDate);
			const lastDate = Helpers.convertDatetimeLocalForDb(endMonth < maxDate ? endMonth : maxDate);
			const startDate = startToday;
			const endDate = lastDate;
			const meetingsDb = await Meetings.getPageByDateMeetingsAndCountry(country.id, startDate, endDate, currentPagination?.currentPage);
			if (meetingsDb.data.length === 0) return [];
			
			const countMeetingsDb = await Meetings.getCountByDateMeetingAndCountry(country.id, startDate, endDate);
			const countMeetings = Helpers.calculateCountPageByCountRows(parseInt(countMeetingsDb?.data[0]?.countRowsSqlRequest));
			const nameCurrentMonth = Helpers.getNameMonthByDate(currentDate, ML.getLanguage());
			if (nameCurrentMonth) setNameMonth(nameCurrentMonth);
			if (currentDate) setNameDay(currentDate.toLocaleDateString());
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

		if (selectFilter.basic === Constants.nameBasicFilter.day) {
			const newDate = new Date();
			let currentDate;
			if (activeStartDateChange && !selectedDay) {
				if (activeStartDateChange?.activeStartDate > newDate) {
					currentDate = activeStartDateChange?.activeStartDate;
				} else {
					currentDate = newDate;
				}
			} else if (selectedDay) {
				currentDate = selectedDay;
			} else {
				currentDate = newDate;
			}
			setSelectedDay(currentDate);
			const startDay = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(currentDate));
			const endDay = Helpers.getEndDayByDate(currentDate);
			const lastDate = Helpers.convertDatetimeLocalForDb(endDay);
			const startDate = startDay;
			const endDate = lastDate;
			const meetingsDb = await Meetings.getPageByDateMeetingsAndCountry(country.id, startDate, endDate, currentPagination?.currentPage);
			if (meetingsDb.data.length === 0) return [];

			const countMeetingsDb = await Meetings.getCountByDateMeetingAndCountry(country.id, startDate, endDate);
			const countMeetings = Helpers.calculateCountPageByCountRows(parseInt(countMeetingsDb?.data[0]?.countRowsSqlRequest));
			const nameCurrentMonth = Helpers.getNameMonthByDate(currentDate, ML.getLanguage());
			if (nameCurrentMonth) setNameMonth(nameCurrentMonth);
			if (currentDate) setNameDay(currentDate.toLocaleDateString());
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
		clearDataMeetings();
	}

	const getDataByIdUser = async () => {
		const meetingsDb = await getListMeetingsDb();
		dispatch(MeetingsSlice.getMeetingsWithFullDataAsync({meetingsDb, listCountries, listCities, listInterests, listCategories, listLanguages, textTranslation}));
	}

	useEffect(() => {
		clearData();
		async function startFetching() {
			ML.setLanguageByPath(router.query.countries as string, listLanguages, country);
			setLoading(false);
		}
		startFetching();
		setMounted(true);
	}, [])

	useEffect(() => {
		if (!loading && Object.keys(textTranslation).length) {
			getDataByIdUser();
		}
	}, [loading, selectFilter, currentPagination?.currentPage, activeStartDateChange, selectedDay])

	useEffect(() => {
		dispatch(UserSlice.getIdUserAsync(session));

	}, [session, status]);

	useEffect(() => {
		if (selectFilter.basic === Constants.nameBasicFilter.month) {
			setSelectedDay(null);
		}
	}, [selectFilter])

	const changeActiveStartDateChange = (e) => {
		setActiveStartDateChange(e);
		setSelectedDay(null);
		dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.month));
	}

	const changeSelectedDay = (e) => {
		setSelectedDay(e || null);
		dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.day));
	}

	return (
		<>
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
			</Head>
			<Main>
				{mounted &&
					<div>
						<Calendar
							onChange={changeSelectedDay} value={selectedDay}
							minDate={new Date()} maxDate={new Date(maxDate)}
							minDetail={"month"} maxDetail={"month"}
							locale={metadata.lang}
							onActiveStartDateChange={changeActiveStartDateChange}
							tileClassName={({ date }) => {
								if (meetings) {
									const dateMark = meetings.find(meeting => {
										const meetingDate = new Date(meeting.dateMeeting);
										if (date.getYear() === meetingDate.getYear() && date.getMonth() === meetingDate.getMonth() && date.getDate() === meetingDate.getDate()) return true;
									});
									
									return dateMark ? 'highlight' : '';
								}
							}}
						/>
					</div>
				}
				<SelectCity listCities={listCities} text={textTranslation}></SelectCity>
				{loading
					? <Loading textTranslation={textTranslation[ML.key.loading]} />
					: 
						<DivWithTopPanel
							topPanel={
								<>
									<ButtonList>
										<Button name={nameMonth} selected={selectFilter.basic === Constants.nameBasicFilter.month ? true : false} onClick={() => dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.month))} />
										<Button name={nameDay} selected={selectFilter.basic === Constants.nameBasicFilter.day ? true : false} onClick={() => changeSelectedDay()} />
									</ButtonList>
								</>
							}
							meetingsListMain={true}
						>
							<MeetingsList namePagination={Constants.namePagination.meetingsList} />
						</DivWithTopPanel>
				}
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
	listCities: CitiesInterface.City[];
	listLanguages: LanguagesInterface.Languages[];
	text: LanguageTranslationInterface.TextTranslation;
	country: CountriesInterface.Country;
	metadata: MetadataInterface.Main;
}