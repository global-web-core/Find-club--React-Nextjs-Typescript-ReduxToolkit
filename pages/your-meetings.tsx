import styles from '../styles/YourMeetingsPage.module.css'
import { Main, Loading, Alert, Button, DivWithTopPanel, MeetingsList, ButtonList, FilterMeetings, BlockMeetings } from '../components';
import { Cities, Countries, Interests, Languages, Categories, Meetings, Users, Desires } from '../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, LanguagesInterface, CategoryInterface, MeetingsInterface, DesiresInterface } from '../interfaces';
import { ML, Helpers, Constants } from '../globals';
import { ReactElement, useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { AlertsSlice, MeetingsSlice, DesiresSlice, TextTranslationSlice, UserSlice, SelectFilterSlice } from '../store/slices'
import {useAppDispatch, useAppSelector} from '../store/hook'
import Head from 'next/head';
import { Layout } from '../layout/Layout';

export default function YourMeetingsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	const router = useRouter();
	
	// State
	const [loading, setLoading] = useState(true);
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Languages[]>([]);
	const [listCountries, setListCountries] = useState<CountriesInterface.Country[]>([]);
	const [listCities, setListCities] = useState<CitiesInterface.Db[]>([]);
	const [listInterests, setListInterests] = useState<InterestsInterface.Interest[]>([]);
	const [listCategories, setListCategories] = useState<CategoryInterface.Db[]>([]);
	const idUser = useAppSelector(state => UserSlice.userSelect(state));
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const listIdMeetings = useAppSelector(state => MeetingsSlice.listIdMeetingsSelect(state));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));

	useEffect(() => {
		async function startFetching() {
			const languagesDb = await Languages.getAll();
			const listLanguagesDb = languagesDb.data;
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);

			const countriesDb = await Countries.getAll();
			console.log('===countriesDb', countriesDb)
			const listCountriesDb = countriesDb.data;
			
			const citiesDb = await Cities.getAll();
			const listCitiesDb = citiesDb.data;
			
			const interestsDb = await Interests.getAll();
			const listInterestsDb = interestsDb.data;
			
			const categoriesDb = await Categories.getAll();
			const listCategoriesDb = categoriesDb.data;
			
			setListCountries(listCountriesDb);
			setListCities(listCitiesDb);
			setListInterests(listInterestsDb);
			setListCategories(listCategoriesDb);

			setLoading(false);
		}
		startFetching();
	}, [])

	useEffect(() => {
		if (!session && status !== 'loading') {
			clearData();
			signIn();
		}

		if (session && status === 'authenticated' && !loading) {
			getDataByIdUser();
		}
	}, [session, status, loading, selectFilter, textTranslation])

	useEffect(() => {
		if (meetings?.length > 0) {
			dispatch(DesiresSlice.getDesiresByIdMeeting({textTranslation, listIdMeetings}))
		}

	}, [meetings])

	useEffect(() => {
		dispatch(UserSlice.getIdUserAsync(session));
	}, [session]);
	
	const clearData = () => {
		dispatch(UserSlice.clearAll());
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
	}

	const getListMeetingsDb = async () => {
		const currentDate = Helpers.convertDatetimeLocalForDb(new Date());
		const idUserSession = idUser;
		let desiresDb;
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.all) desiresDb = await Desires.getByIdUser(idUserSession);
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.my) desiresDb = await Desires.getByIdUserByStatusOrganizer(idUserSession, Constants.statusOrganizer.MY);
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.other) desiresDb = await Desires.getByIdUserByStatusOrganizer(idUserSession, Constants.statusOrganizer.ANOTHER);
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.passed) desiresDb = await Desires.getByIdUser(idUserSession);
		
		const selectedMeetings: number[] = [];
		let listMeetings: MeetingsInterface.Meetings[] = [];
		
		for (let index = 0; index < desiresDb.data.length; index++) {
			if (!selectedMeetings.includes(desiresDb.data[index]?.idMeeting)) {
				selectedMeetings.push({idMeeting: desiresDb.data[index]?.idMeeting, statusWish: desiresDb.data[index]?.statusWish, statusReadiness: desiresDb.data[index]?.statusReadiness});
			}
		}

		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.passed) {
			for await (const selectedMeeting of selectedMeetings) {
				const meeting = (await Meetings.getByIdMeetingLessDate(selectedMeeting.idMeeting, currentDate))?.data[0];
				if (meeting) listMeetings.push(meeting);
			}
		} else {
			for await (const selectedMeeting of selectedMeetings) {
				const meeting = (await Meetings.getByIdMeetingMoreDate(selectedMeeting.idMeeting, currentDate))?.data[0];
				if (meeting) listMeetings.push(meeting);
			}
		}

		listMeetings.sort((a, b) => {
			return new Date (a.dateMeeting) - new Date (b.dateMeeting);
		});

		return listMeetings;
	}

	const getDataByIdUser = async () => {
		const meetingsDb = await getListMeetingsDb();
		dispatch(MeetingsSlice.getMeetingsWithFullDataAsync({meetingsDb, listCountries, listCities, listInterests, listCategories, listLanguages, textTranslation}));
	}

	if (session && status === 'authenticated') {
		return (
			<>
				<Head>
					<title>{textTranslation[ML.key.titleYourMeetings]}</title>
					<meta name="description" content={textTranslation[ML.key.descriptionYourMeetings]} />
				</Head>
				<Main>
					<h1 className={styles.title}>{textTranslation[ML.key.yourMeetings]}</h1>
					{loading
						? <Loading textTranslation={textTranslation[ML.key.loading]} />
						:
							<BlockMeetings/>
					}
					<Button  name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				</Main>
			</>
		);
	}

	return (
		<></>
	);
}

YourMeetingsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}