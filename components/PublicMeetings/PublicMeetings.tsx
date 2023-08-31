import { useEffect, useState } from 'react';
import { Constants, Helpers, ML } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { CalendarMeetingsSlice, MeetingsSlice, PaginationSlice, SelectFilterSlice, UserSlice } from '../../store/slices';
import styles from './PublicMeetings.module.css';
import { PublicMeetingsProps } from './PublicMeetings.props';
import { useRouter } from 'next/router';
import {BlockMeetings, CalendarMeetings, Loading, NavigationMeetings} from '../../components';

export const PublicMeetings = ({listCountries, listLanguages, country, textTranslation, metadata, getMeetingsFromDb, listCities, listInterests, listCategories, clearDataMeetings, language}: PublicMeetingsProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const selectedDayCalendar = useAppSelector(state => CalendarMeetingsSlice.selectedDaySelect(state));
	const selectedDay = selectedDayCalendar ? Helpers.convertFromReduxToDatetimeLocal(selectedDayCalendar) : undefined;
	const activeStartDateChange = useAppSelector(state => CalendarMeetingsSlice.activeStartDateChangeSelect(state));
	const calendarMeetings = useAppSelector(state => CalendarMeetingsSlice.calendarMeetingsSelect(state));
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, Constants.namePagination.meetingsList));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);
	const [title, setTitle] = useState<string | undefined>('');

	const clearDataUsers = () => {
		dispatch(UserSlice.clearAll());
	}

	const clearData = () => {
		clearDataUsers();
		clearDataMeetings();
	}


	const getFilteredMeetings = () => {
		if (selectFilter.basic === Constants.nameBasicFilter.month || selectFilter.basic === Constants.nameBasicFilter.day) {
			const dates = Helpers.getStartDateAndEndDateBySelectFilter(selectFilter, calendarMeetings, activeStartDateChange, selectedDay);
			if (selectFilter.basic === Constants.nameBasicFilter.day) {
				if (dates?.selectedDay) dispatch(CalendarMeetingsSlice.setSelectedDay(dates?.selectedDay));
			}
			if (dates?.startDate && dates?.endDate) return getMeetingsFromDb(dates?.startDate, dates?.endDate);
		}
		clearDataMeetings();
	}

	const getMainData = async () => {
		const meetingsDb = await getFilteredMeetings();
		if (meetingsDb) dispatch(MeetingsSlice.getMeetingsWithFullDataAsync({meetingsDb, listCountries, listCities, listInterests, listCategories, listLanguages, textTranslation}));
	}

	useEffect(() => {
		clearData();
		async function startFetching() {
			if (typeof router.query.countries === "string") ML.setLanguageByPath(router.query.countries, listLanguages, country);
			setLoading(false);
		}
		startFetching();
		setMounted(true);
		getTitle();
	}, [])

	useEffect(() => {
		if (!loading && Object.keys(textTranslation).length) {
			getMainData();
		}
	}, [loading, selectFilter, currentPagination?.currentPage, activeStartDateChange, selectedDayCalendar])

	const getTitle = () => {
		let currentTitle: string | undefined;
		if (Object.keys(router.query).length === 1 && router.query.countries) {
			const countryFromUrl = typeof router.query.countries === "string" && Helpers.getCountryByUrlCountry(router.query.countries);
			if (countryFromUrl) currentTitle = textTranslation[countryFromUrl] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		} else if (Object.keys(router.query).length === 2 && router.query.cities) {
			if (typeof router.query.cities === "string") currentTitle = textTranslation[router.query.cities] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		} else if (Object.keys(router.query).length === 3 && router.query.interests) {
			if (typeof router.query.interests === "string") currentTitle = textTranslation[router.query.interests] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		} else if (Object.keys(router.query).length === 4 && router.query.categories) {
			if (typeof router.query.categories === "string") currentTitle = textTranslation[router.query.categories] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		}
		setTitle(currentTitle);
	}

	return (
		<>
			{mounted &&
				<div>
					<CalendarMeetings metadataLanguage={metadata.lang} language={language} />
				</div>
			}
			<NavigationMeetings listCountries={listCountries} listLanguages={listLanguages} textTranslation={textTranslation} />
			<h1 className={styles.title}>{title}</h1>
			{loading
				? <Loading/>
				: 
					<BlockMeetings/>
			}
		</>
	);
};