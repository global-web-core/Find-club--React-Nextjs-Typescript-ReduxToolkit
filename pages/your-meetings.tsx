import styles from '../styles/YourMeetingsPage.module.css'
import { BreadCrumbs, Login, Main, SelectLanguage, Loading, Alert, Button, Accordion, ListEmpty, DivDefault } from '../components';
import { Cities, Countries, Interests, Languages, Categories, Meetings, Users, Desires } from '../models';
import { useRouter } from 'next/router';
import { CountriesInterface, InterestsInterface, CitiesInterface, LanguagesInterface, CategoryInterface, MeetingsInterface, DesiresInterface } from '../interfaces';
import { ML, Helpers, Constants } from '../globals';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import cn from 'classnames';
import { AlertsSlice, MeetingsSlice, DesiresSlice, TextTranslationSlice } from '../store/slices'
import {useAppDispatch, useAppSelector} from '../store/hook'

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
	const routerQuery = router.pathname;
	
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
	const desires = useAppSelector(state => DesiresSlice.desiresSelect(state));
	const [lengthDesires, setLengthDesires] = useState<LengthDesires[]>([]);

	const updateLanguage = () => {
		dispatch(TextTranslationSlice.updateLanguageAsync())
	}

	useEffect(() => {
		async function startFetching() {
			const languagesDb = await Languages.getAll();
			const listLanguagesDb = languagesDb.data;
			setListLanguages(listLanguagesDb);
			ML.setLanguageByBrowser(listLanguagesDb);
			updateLanguage();

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
		if (desires.length > 0) {
			getLengthDesires();
		}

	}, [desires])

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

	const getLengthDesires = async () => {
		const listLengthDesires: LengthDesires[] = [];
		const listIdMeetings = getListIdMeetings();
		
		for await (const idMeeting of listIdMeetings) {
			let lengthWish = 0;
			let lengthReadiness = 0;
			
			(await Desires.getByIdMeeting(idMeeting))?.data.forEach((desire: DesiresInterface.Desires) => {
				if (desire.statusWish === Constants.statusWish.WISH) lengthWish++;
				if (desire.statusReadiness === Constants.statusReadiness.READINESS) lengthReadiness++;
			})

			listLengthDesires.push({idMeeting: idMeeting, lengthWish: lengthWish, lengthReadiness: lengthReadiness});
		}
		setLengthDesires(listLengthDesires);
	}

	const getListIdMeetings = () => {
		const idMeetings: number[] = [];
		for (let index = 0; index < meetings.length; index++) {
			if (!idMeetings.includes(meetings[index]?.id)) idMeetings.push(meetings[index]?.id);
		}
		return idMeetings;
	}

	const getLengthWish = (idMeeting: number) => {
		const currentDesire = lengthDesires.find(desire => desire.idMeeting === idMeeting);
		if (currentDesire) return currentDesire.lengthWish;
		return 0;
	}

	const getLengthReadiness = (idMeeting: number) => {
		const currentDesire = lengthDesires.find(desire => desire.idMeeting === idMeeting);
		if (currentDesire) return currentDesire.lengthReadiness;
		return 0;
	}

	const changeStatusMeeting = async (status: number, idMeeting: number) => {
		let newStatus: {status: 0 | 1} | undefined;
		if (status === Constants.activyStatus.ACTIVE) newStatus = {status: Constants.activyStatus.NOT_ACTIVE};
		if (status === Constants.activyStatus.NOT_ACTIVE) newStatus = {status: Constants.activyStatus.ACTIVE};
		await Meetings.update(idMeeting, newStatus);
		const updateMeeting: MeetingsInterface.MeetingsWithDependentData[] = [];
		
		meetings.forEach(meeting => {
			const currentMeeting: MeetingsInterface.MeetingsWithDependentData = JSON.parse(JSON.stringify(meeting));
			
			if (currentMeeting.id === idMeeting) {
				if (newStatus?.status !== undefined) currentMeeting.status = newStatus?.status;
			}
			updateMeeting.push(currentMeeting);
		})
		dispatch(MeetingsSlice.addAll(updateMeeting));
		
	}

	const changeStatusWish = async (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		
		if (currentDesires && currentDesires?.id) {
			const newStatusWish = currentDesires.statusWish === Constants.statusWish.WISH ? {statusWish: Constants.statusWish.NOWISH} : {statusWish: Constants.statusWish.WISH};
			await Desires.update(currentDesires.id, newStatusWish);
			const getUpdateDesire = await Desires.getById(currentDesires.id);
			if (getUpdateDesire?.data.length > 0) {
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
			}
		}
	}

	const changeStatusReadiness = async (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);

		if (currentDesires && currentDesires?.id) {
			const newStatusReadiness = currentDesires.statusReadiness === Constants.statusReadiness.READINESS ? {statusReadiness: Constants.statusReadiness.NOREADINESS} : {statusReadiness: Constants.statusReadiness.READINESS};
			await Desires.update(currentDesires.id, newStatusReadiness);
			const getUpdateDesire = await Desires.getById(currentDesires.id);
			if (getUpdateDesire?.data.length > 0) {
				const updateDesire = getUpdateDesire.data[0];
				const desiresWithoutUpdateDesire = desires.filter(desire => desire.id !== getUpdateDesire.data[0].id);
				dispatch(DesiresSlice.addAll([...desiresWithoutUpdateDesire, updateDesire]));
			}
		}
	}

	const checkStatusWish = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusWish === Constants.statusWish.WISH) {
			return true;
		}
		return false;
	}

	const checkStatusReadiness = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusReadiness === Constants.statusReadiness.READINESS) {
			return true;
		}
		return false;
	}

	const checkOwnDesires = (idMeeting: number) => {
		const currentDesires = desires.find(desire => desire.idMeeting === idMeeting && desire.idUser === idUser);
		if (currentDesires?.statusOrganizer === Constants.statusOrganizer.MY) {
			return true;
		}
		return false;
	}
	

	if (session && status === 'authenticated') {
		return (
			<Main>
				<Login/>
				<BreadCrumbs currentRoute={routerQuery} text={textTranslation} />
				<SelectLanguage listLanguages={listLanguages} text={textTranslation} updateLanguage={() => updateLanguage()}  country={null}></SelectLanguage>
				<h1 className={styles.title}>{textTranslation[ML.key.yourMeetings]}</h1>
				{loading
					? <Loading textTranslation={textTranslation[ML.key.loading]} />
					: 
						<DivDefault>
							<div className={styles.filters}>
								<div className={styles.listButton}>
									<Button name={textTranslation[ML.key.all]} selected={selectFilter === nameFilter.all ? true : false} onClick={() => setSelectFilter(nameFilter.all)} />
									<Button name={textTranslation[ML.key.iOrganise]} selected={selectFilter === nameFilter.my ? true : false} onClick={() => setSelectFilter(nameFilter.my)} />
									<Button name={textTranslation[ML.key.organizedByOthers]} selected={selectFilter === nameFilter.other ? true : false} onClick={() => setSelectFilter(nameFilter.other)} />
									<Button name={textTranslation[ML.key.alreadyGone]}  selected={selectFilter === nameFilter.passed ? true : false} onClick={() => setSelectFilter(nameFilter.passed)} />
								</div>
							</div>
							<div className={styles.meetings}>
								{meetings && meetings.map((v) => (
									<Accordion key={v.id}
										header={
											<>
												<div className={styles.meeting}>
													<div className={styles.nameMeeting}>
														<h2>{v.interest}</h2>
														<span className={styles.helperArrow}>&nbsp;→&nbsp;</span>
														<h3>{v.category}</h3>
													</div>
													<div>{Helpers.currentDatetimeDbToDatetimeLocalString(v.dateMeeting)}</div>
													<div className={styles.statistic}>
														<div className={styles.itemStatistic}>
															<div>{textTranslation[ML.key.wanted]}: {getLengthWish(v.id)}</div>
														</div>
														<div className={styles.itemStatistic}>
															<div>{textTranslation[ML.key.confirmations]}: {getLengthReadiness(v.id)}</div>
														</div>
													</div>
												</div>
											</>
										}

										hideContent={
											<>
												<div className={styles.hideContent}>
													<hr/>
													<div className={styles.mainContent}>
													<div className={cn(styles.statistic, styles.statisticWithoutArrow)}>
														<div className={styles.itemStatistic}>
															{!checkOwnDesires(v.id) &&
																<>
																	<div className={styles.minor}>{checkStatusWish(v.id) ? textTranslation[ML.key.iPlanToGo] : textTranslation[ML.key.iNotGoing]}</div>
																	<Button  name={checkStatusWish(v.id) ? textTranslation[ML.key.iNotGoing] : textTranslation[ML.key.planningToGo]} onClick={() => changeStatusWish(v.id)}/>
																</>
															}
														</div>
														<div className={styles.itemStatistic}>
															{!checkOwnDesires(v.id) &&
																<>
																	<div className={styles.minor}>{checkStatusReadiness(v.id) ? textTranslation[ML.key.iDefinitelyComing] : textTranslation[ML.key.undecided]}</div>
																	<Button  name={checkStatusReadiness(v.id) ? textTranslation[ML.key.undecided] : textTranslation[ML.key.definitelyComing]} onClick={() => changeStatusReadiness(v.id)}/>
																</>
															}
														</div>
													</div>
														<div className={styles.minor}>{checkOwnDesires(v.id) ? textTranslation[ML.key.iOrganise] : textTranslation[ML.key.organisesAnother]}</div>
														<div className={styles.minor}>{textTranslation[ML.key.languagePeopleMeeting]} {v.language}</div>
														<div className={cn(styles.location, styles.minor)}>
															<div>{v.country}&nbsp;→&nbsp;</div>
															<div>{v.city}</div>
														</div>
														<div>{v.placeMeeting.length > 0 ? textTranslation[ML.key.meetingPoint] + ': ' + v.placeMeeting : textTranslation[ML.key.meetingNotSpecifiedDiscuss]}</div>
														<div className={styles.statusMeeting}>
															<div className={styles.controlButton}>
																<Button  name={textTranslation[ML.key.goToChat]}/>
															</div>
															{checkOwnDesires(v.id)
																?
																	<div className={cn(styles.controlButton, styles.minor)}>
																		<div className={styles.emptyBlock}>{v.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.meetingWill] : textTranslation[ML.key.meetingCancelled]}</div>
																		<Button  name={v.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.cancelMeeting] : textTranslation[ML.key.resumeMeeting]} onClick={() => changeStatusMeeting(v.status, v.id)}/>
																	</div>
																:
																	<div className={cn(styles.emptyBlock, styles.minor)}>{v.status === Constants.activyStatus.ACTIVE ? textTranslation[ML.key.meetingWill] : textTranslation[ML.key.meetingCancelled]}</div>
															}
															
														</div>
													</div>
												</div>
											</>
										}
									/>
								))}
								{meetings.length === 0 && <ListEmpty/>}
							</div>
						</DivDefault>
				}
				<Button  name={textTranslation[ML.key.offerToMeet]} onClick={() => {router.push({pathname: '/propose-meeting'})}} />
				<Alert/>
			</Main>
		);
	}

	return (
		<></>
	);
}

interface LengthDesires {
	idMeeting: number;
	lengthWish: number;
	lengthReadiness: number;
}