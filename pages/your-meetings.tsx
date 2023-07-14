import styles from '../styles/YourMeetingsPage.module.css'
import { Main, Loading, Alert, Button, DivWithTopPanel, MeetingsList, ButtonList } from '../components';
import { Cities, Countries, Interests, Languages, Categories, Meetings, Users, Desires } from '../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, LanguagesInterface, CategoryInterface, MeetingsInterface, DesiresInterface } from '../interfaces';
import { ML, Helpers, Constants } from '../globals';
import { ReactElement, useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { AlertsSlice, MeetingsSlice, DesiresSlice, TextTranslationSlice } from '../store/slices'
import {useAppDispatch, useAppSelector} from '../store/hook'
import Head from 'next/head';
import { Layout } from '../layout/Layout';

const nameFilter = {
	all: 'all',
	my: 'my',
	other: 'other',
	passed: 'passed'
};

export default function YourMeetingsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const { data: session, status } = useSession();
	const router = useRouter();
	
	// State
	const [loading, setLoading] = useState(true);
	const textTranslation = useAppSelector(state => TextTranslationSlice.textTranslationSelect(state));
	const [listLanguages, setListLanguages] = useState<LanguagesInterface.Languages[]>([]);
	const [listCountries, setListCountries] = useState<CountriesInterface.Country[]>([]);
	const [listCities, setListCities] = useState<CitiesInterface.City[]>([]);
	const [listInterests, setListInterests] = useState<InterestsInterface.Interest[]>([]);
	const [listCategories, setListCategories] = useState<CategoryInterface.Category[]>([]);
	const [idUser, setIdUser] = useState('');
	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const [selectFilter, setSelectFilter] = useState(nameFilter.all);

	useEffect(() => {
		async function startFetching() {
			const languagesDb = await Languages.getAll();
			const listLanguagesDb = languagesDb.data;
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);

			const countriesDb = await Countries.getAll();
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
		if (meetings.length > 0) {
			getDesiresByIdMeeting();
		}

	}, [meetings])

	useEffect(() => {
		getCurrentIdUser();
	}, [session]);
	
	const clearData = () => {
		setIdUser('');
		dispatch(MeetingsSlice.clearAll());
		dispatch(DesiresSlice.clearAll());
	}

	const getCurrentIdUser = async () => {
		const dataUserBySession = await Users.getBySession(session?.user?.email, session?.user?.image, session?.user?.name)
		const idUserSession = dataUserBySession?.data.length > 0 && dataUserBySession?.data[0].id || null;
		setIdUser(idUserSession);
	}

	const getListMeetings = async () => {
		const idUserSession = idUser;
		let desiresDb;
		if (selectFilter === nameFilter.all) desiresDb = await Desires.getByIdUser(idUserSession);
		if (selectFilter === nameFilter.my) desiresDb = await Desires.getByIdUserByStatusOrganizer(idUserSession, Constants.statusOrganizer.MY);
		if (selectFilter === nameFilter.other) desiresDb = await Desires.getByIdUserByStatusOrganizer(idUserSession, Constants.statusOrganizer.ANOTHER);
		if (selectFilter === nameFilter.passed) desiresDb = await Desires.getByIdUser(idUserSession);
		
		const idMeetings: number[] = [];
		let listMeetings: MeetingsInterface.Meetings[] = [];
		
		for (let index = 0; index < desiresDb.data.length; index++) {
			if (!idMeetings.includes(desiresDb.data[index]?.idMeeting)) idMeetings.push(desiresDb.data[index]?.idMeeting);
		}

		for await (const idMeeting of idMeetings) {
			listMeetings.push((await Meetings.getByIdMeeting(idMeeting))?.data[0]);
		}

		if (selectFilter === nameFilter.passed) {
			const filteredListMeetings = Helpers.filterPastDate(listMeetings, 'dateMeeting');
			
			listMeetings = filteredListMeetings || listMeetings;
		}
		
		return listMeetings;
	}

	const getDataByIdUser = async () => {
		const meetingsDb = await getListMeetings();

		const dataMeetings: MeetingsInterface.MeetingsWithDependentData[] = [];

		if (meetingsDb.length > 0) {
			meetingsDb.forEach((meeting) => {
				const country = listCountries.find(country => country.id === meeting.idCountry);
				const city = listCities.find(city => city.id === meeting.idCity);
				const interest = listInterests.find(interest => interest.id === meeting.idInterest);
				const category = listCategories.find(category => category.id === meeting.idCategory);
				const language = listLanguages.find(language => language.id === meeting.idLanguage);
				if (country?.route && city?.route && interest?.route && category?.route && language?.name) {
					const dataMeeting: MeetingsInterface.MeetingsWithDependentData = {
						id: meeting.id,
						country: textTranslation[country.route],
						city: textTranslation[city.route],
						interest: textTranslation[interest.route],
						category: textTranslation[category.route],
						language: language.name,
						placeMeeting: meeting.placeMeeting,
						dateMeeting: meeting.dateMeeting,
						typeMeeting: meeting.typeMeeting,
						status: meeting.status
					};

					if (!dataMeetings.includes(dataMeeting)) dataMeetings.push(dataMeeting);
				} else {
					dispatch(AlertsSlice.add(textTranslation[ML.key.receivingMeeting], textTranslation[ML.key.error], 'danger'));
					return;
				}
			});
		}
		dispatch(MeetingsSlice.addAll(dataMeetings));
	}

	const getDesiresByIdMeeting = async () => {
		const idMeetings = getListIdMeetings();

		const listDesiresDb: DesiresInterface.Desires[] = [];
		for await (const idMeeting of idMeetings) {
			const listDesiresByIdMeeting: DesiresInterface.Desires[] = (await Desires.getByIdMeeting(idMeeting))?.data;
			listDesiresByIdMeeting.forEach(desire => {
				if (!listDesiresDb.includes(desire)) {
					listDesiresDb.push(desire);
				}
			});
			listDesiresDb.push();
		}

		dispatch(DesiresSlice.addAll(listDesiresDb));
	}

	const getListIdMeetings = () => {
		const idMeetings: number[] = [];
		for (let index = 0; index < meetings.length; index++) {
			if (!idMeetings.includes(meetings[index]?.id)) idMeetings.push(meetings[index]?.id);
		}
		return idMeetings;
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
							<DivWithTopPanel
								topPanel={
									<>
										<ButtonList>
											<Button name={textTranslation[ML.key.all]} selected={selectFilter === nameFilter.all ? true : false} onClick={() => setSelectFilter(nameFilter.all)} />
											<Button name={textTranslation[ML.key.iOrganise]} selected={selectFilter === nameFilter.my ? true : false} onClick={() => setSelectFilter(nameFilter.my)} />
											<Button name={textTranslation[ML.key.organizedByOthers]} selected={selectFilter === nameFilter.other ? true : false} onClick={() => setSelectFilter(nameFilter.other)} />
											<Button name={textTranslation[ML.key.alreadyGone]}  selected={selectFilter === nameFilter.passed ? true : false} onClick={() => setSelectFilter(nameFilter.passed)} />
										</ButtonList>
									</>
								}
							>
								<MeetingsList meetings={meetings} idUser={idUser} getListIdMeetings={() => getListIdMeetings()} />
							</DivWithTopPanel>
					}
					<Button  name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
					<Alert/>
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