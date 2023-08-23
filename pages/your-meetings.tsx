import styles from '../styles/YourMeetingsPage.module.css'
import { Main, Loading, Button, BlockMeetings } from '../components';
import { Cities, Countries, Interests, Languages, Categories, Meetings, Desires } from '../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, LanguagesInterface, CategoryInterface, MeetingsInterface, DesiresInterface, HttpInterface, YourMeetingsInterface } from '../typesAndInterfaces/interfaces';
import { ML, Helpers, Constants } from '../globals';
import { ReactElement, useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MeetingsSlice, DesiresSlice, TextTranslationSlice, UserSlice, SelectFilterSlice } from '../store/slices'
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
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Db[]>([]);
	const [listCountries, setListCountries] = useState<CountriesInterface.Db[]>([]);
	const [listCities, setListCities] = useState<CitiesInterface.Db[]>([]);
	const [listInterests, setListInterests] = useState<InterestsInterface.Db[]>([]);
	const [listCategories, setListCategories] = useState<CategoryInterface.Db[]>([]);
	const dataUser = useAppSelector(state => UserSlice.userSelect(state));
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const listIdMeetings = useAppSelector(state => MeetingsSlice.listIdMeetingsSelect(state));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));

	useEffect(() => {
		async function startFetching() {
			const languagesDb = await Languages.getAll();
			const listLanguagesDb = languagesDb?.data;
			
			const countriesDb = await Countries.getAll();
			const listCountriesDb = countriesDb?.data;
			
			const citiesDb = await Cities.getAll();
			const listCitiesDb = citiesDb?.data;
			
			const interestsDb = await Interests.getAll();
			const listInterestsDb = interestsDb?.data;
			
			const categoriesDb = await Categories.getAll();
			const listCategoriesDb = categoriesDb?.data;

			if (!listLanguagesDb || !listCountriesDb || !listCitiesDb || !listInterestsDb || !listCategoriesDb) {
				setLoading(false);
				return;
			}
			
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);
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
		if (session?.user?.email && session?.user?.image && session?.user?.name) dispatch(UserSlice.getIdUserAsync({email: session?.user?.email, image: session?.user?.image, name: session?.user?.name, textTranslation}));
	}, [session]);
	
	const clearData = () => {
		dispatch(UserSlice.clearAll());
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
	}

	const getListMeetingsDb = async () => {
		const currentDate = Helpers.convertDatetimeLocalForDb(new Date());
		const idUserSession = dataUser.id;
		let desiresDb: HttpInterface.Get<DesiresInterface.Db> | undefined;
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.all && idUserSession) desiresDb = await Desires.getByIdUser(idUserSession);
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.my && idUserSession) desiresDb = await Desires.getByIdUserByStatusOrganizer(idUserSession, Constants.statusOrganizer.MY);
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.other && idUserSession) desiresDb = await Desires.getByIdUserByStatusOrganizer(idUserSession, Constants.statusOrganizer.ANOTHER);
		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.passed && idUserSession) desiresDb = await Desires.getByIdUser(idUserSession);
		
		const selectedMeetings: YourMeetingsInterface.SelectedMeetings[] = [];
		const listMeetings: MeetingsInterface.Db[] = [];
		
		if (desiresDb?.data !== undefined) {
			for (let index = 0; index < desiresDb.data.length; index++) {
				if (!selectedMeetings.some(meeting => meeting.idMeeting === desiresDb?.data?.[index]?.idMeeting)) {
					selectedMeetings.push({idMeeting: desiresDb.data[index]?.idMeeting, statusWish: desiresDb.data[index]?.statusWish, statusReadiness: desiresDb.data[index]?.statusReadiness});
				}
			}
		}

		if (selectFilter.yourMeetings === Constants.nameYourMeetingsFilter.passed) {
			for await (const selectedMeeting of selectedMeetings) {
				const meeting = (await Meetings.getByIdMeetingLessDate(selectedMeeting.idMeeting, currentDate))?.data?.[0];
				if (meeting) listMeetings.push(meeting);
			}
		} else {
			for await (const selectedMeeting of selectedMeetings) {
				const meeting = (await Meetings.getByIdMeetingMoreDate(selectedMeeting.idMeeting, currentDate))?.data?.[0];
				if (meeting) listMeetings.push(meeting);
			}
		}

		listMeetings.sort((a, b) => {
			return new Date (a.dateMeeting).getTime() - new Date (b.dateMeeting).getTime();
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