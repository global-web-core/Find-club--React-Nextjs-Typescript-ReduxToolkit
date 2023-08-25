import { useEffect, useState } from 'react';
import { Constants, Helpers, ML } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { CalendarMeetingsSlice, DesiresSlice, MeetingsSlice, PaginationSlice, SelectFilterSlice, UserSlice } from '../../store/slices';
import styles from './PublicMeetings.module.css';
import { PublicMeetingsProps } from './PublicMeetings.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import {BlockMeetings, CalendarMeetings, Loading, NavigationMeetings} from '../../components';

export const PublicMeetings = ({listCountries, listLanguages, country, textTranslation, metadata, getMeetingsFromDb, listCities, listInterests, listCategories, clearDataMeetings, language}: PublicMeetingsProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const selectedDayCalendar = useAppSelector(state => CalendarMeetingsSlice.selectedDaySelect(state));
	const selectedDay = Helpers.convertFromReduxToDatetimeLocal(selectedDayCalendar);
	const activeStartDateChange = useAppSelector(state => CalendarMeetingsSlice.activeStartDateChangeSelect(state));
	const calendarMeetings = useAppSelector(state => CalendarMeetingsSlice.calendarMeetingsSelect(state));
	const currentPagination = useAppSelector(state => PaginationSlice.paginationSelect(state, Constants.namePagination.meetingsList));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));
	const [loading, setLoading] = useState(true);
	const [mounted, setMounted] = useState(false);
	const [title, setTitle] = useState('');

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
				dispatch(CalendarMeetingsSlice.setSelectedDay(dates.selectedDay));
			}
			return getMeetingsFromDb(dates?.startDate, dates?.endDate);
		}
		clearDataMeetings();
	}

	const getMainData = async () => {
		const meetingsDb = await getFilteredMeetings();
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
		getTitle();
	}, [])

	useEffect(() => {
		if (!loading && Object.keys(textTranslation).length) {
			getMainData();
		}
	}, [loading, selectFilter, currentPagination?.currentPage, activeStartDateChange, selectedDayCalendar])

	const getTitle = () => {
		let currentTitle;
		if (Object.keys(router.query).length === 1 && router.query.countries) {
			currentTitle = textTranslation[Helpers.getCountryByUrlCountry(router.query.countries)] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		} else if (Object.keys(router.query).length === 2 && router.query.cities) {
			currentTitle = textTranslation[router.query.cities] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		} else if (Object.keys(router.query).length === 3 && router.query.interests) {
			currentTitle = textTranslation[router.query.interests] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
		} else if (Object.keys(router.query).length === 4 && router.query.categories) {
			currentTitle = textTranslation[router.query.categories] + ' - ' + textTranslation[ML.key.allAvailableMeetings];
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
				? <Loading textTranslation={textTranslation[ML.key.loading]} />
				: 
					<BlockMeetings/>
			}
		</>
	);
};