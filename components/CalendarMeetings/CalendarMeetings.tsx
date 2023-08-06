import React, { useEffect, useState } from 'react';
import styles from './CalendarMeetings.module.css';
import { CalendarMeetingsProps } from './CalendarMeetings.props';
import Calendar from 'react-calendar'
import { CalendarMeetingsSlice, MeetingsSlice, SelectFilterSlice } from '../../store/slices';
import { Constants, Helpers } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Meetings } from '../../models';

export const CalendarMeetings = ({language, country, ...props}: CalendarMeetingsProps):JSX.Element => {
	const dispatch = useAppDispatch();
	const selectedDayCalendar = useAppSelector(state => CalendarMeetingsSlice.selectedDaySelect(state));
	const selectedDay = Helpers.convertFromReduxToDatetimeLocal(selectedDayCalendar);
	const calendarMeetings = useAppSelector(state => CalendarMeetingsSlice.calendarMeetingsSelect(state));
	const activeStartDateChange = useAppSelector(state => CalendarMeetingsSlice.activeStartDateChangeSelect(state));

	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const [dateMeetingsForMonth, setDateMeetingsForMonth] = useState([]);
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));

	const maxDate = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.maxDate);

	const changeSelectedDay = (e) => {
		if (!e && activeStartDateChange) {
			const activeStartDate = Helpers.convertFromReduxToDatetimeLocalAndShiftTimezone(activeStartDateChange?.activeStartDate);
			e = activeStartDate;
		}
		dispatch(CalendarMeetingsSlice.setSelectedDay(e || null));
		if (selectFilter.basic === Constants.nameBasicFilter.month) dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.day));
	}

	const changeActiveStartDateChange = (e) => {
		dispatch(CalendarMeetingsSlice.setActiveStartDateChange(e));
		dispatch(CalendarMeetingsSlice.setSelectedDay(null));
		dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.month));
	}

	useEffect(() => {
		if (selectFilter.basic === Constants.nameBasicFilter.month) {
			dispatch(CalendarMeetingsSlice.setSelectedDay(null));
		}
		if (selectFilter.basic === Constants.nameBasicFilter.day) {
			changeSelectedDay();
		}
	}, [selectFilter])

	useEffect(() => {
		const request = dispatch(CalendarMeetingsSlice.setListDatemeetingsPerMonthAsync({country}));
		return () => request.abort()
	}, [activeStartDateChange])

	return (
		<>
			<Calendar
				onChange={changeSelectedDay} value={selectedDay}
				minDate={new Date()} maxDate={new Date(maxDate)}
				minDetail={"month"} maxDetail={"month"}
				locale={language}
				onActiveStartDateChange={changeActiveStartDateChange}
				tileClassName={({ date }) => {		
					// console.log('===tileClassName')
					if (calendarMeetings.listDatemeetingsPerMonth.data.length > 0) {
						const listDatemeetingsPerMonth = calendarMeetings.listDatemeetingsPerMonth.data
					
						const dateMark = listDatemeetingsPerMonth.find(meetingDate => {
							meetingDate = new Date(meetingDate);
							if (date.getYear() === meetingDate.getYear() && date.getMonth() === meetingDate.getMonth() && date.getDate() === meetingDate.getDate()) return true;
						});
							
						return dateMark ? 'highlight' : '';
					}
				}}
				{...props}
			/>
		</>
	);
};