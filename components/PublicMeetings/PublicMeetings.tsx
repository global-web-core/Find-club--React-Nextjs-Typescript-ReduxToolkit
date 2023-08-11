import { useEffect, useState } from 'react';
import { Constants, Helpers, ML } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { CalendarMeetingsSlice, DesiresSlice, MeetingsSlice, PaginationSlice, SelectFilterSlice, UserSlice } from '../../store/slices';
import styles from './PublicMeetings.module.css';
import { PublicMeetingsProps } from './PublicMeetings.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import {BlockMeetings, CalendarMeetings, Loading, NavigationMeetings} from '../../components';

export const PublicMeetings = ({listCountries, listLanguages, country, textTranslation, metadata, getMeetingsFromDb, listCities, listInterests, listCategories, clearDataMeetings}: PublicMeetingsProps): JSX.Element => {
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
			return getMeetingsFromDb(dates.startDate, dates.endDate);
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
	}, [])

	useEffect(() => {
		if (!loading && Object.keys(textTranslation).length) {
			getMainData();
		}
	}, [loading, selectFilter, currentPagination?.currentPage, activeStartDateChange, selectedDayCalendar])

	return (
		<>
			{mounted &&
				<div>
					<CalendarMeetings language={metadata.lang} country={country.id} />
				</div>
			}
			<NavigationMeetings country={country}  listCountries={listCountries} listLanguages={listLanguages} textTranslation={textTranslation} />
			<h1 className={styles.title}>{textTranslation[ML.key[country.route]] + ' - ' + textTranslation[ML.key.allAvailableMeetings]}</h1>
			{loading
				? <Loading textTranslation={textTranslation[ML.key.loading]} />
				: 
					<BlockMeetings/>
			}
		</>
	);
};