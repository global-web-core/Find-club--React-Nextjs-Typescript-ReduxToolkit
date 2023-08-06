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
		addInlistDatemeetingsPerMonth();
	}, [activeStartDateChange])


	const addInlistDatemeetingsPerMonth = async () => {
		console.log('===addInlistDatemeetingsPerMonth')
		const dateStartMonth = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.activePeriod.start);
		const startDayMonth = dateStartMonth.getDate()
		const endDayMonth = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.activePeriod.end).getDate()

		const listDatePerMonth = [];
		const listDatemeetingsPerMonth = [];

		for (let day = startDayMonth; day <= endDayMonth; day++) {
			const month = dateStartMonth.getMonth();
			const year = dateStartMonth.getFullYear();
			const currentDate = new Date(year, month, day);
			if (currentDate && !listDatePerMonth.includes(currentDate)) listDatePerMonth.push(currentDate)
		}

		for await (const date of listDatePerMonth) {
			const startDay = Helpers.convertDatetimeLocalForDb(Helpers.getStartDayByDate(date));
			const endDay = Helpers.convertDatetimeLocalForDb(Helpers.getEndDayByDate(date));
	
			const meetingDb = await Meetings.getOneByDateMeetingsAndCountry(country, startDay, endDay);
			if (meetingDb && meetingDb.data.length > 0) listDatemeetingsPerMonth.push(date)
		}
		
		console.log('===listDatemeetingsPerMonth', listDatemeetingsPerMonth)
		dispatch(CalendarMeetingsSlice.setListDatemeetingsPerMonthAsync(listDatemeetingsPerMonth));
	}

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
					if (calendarMeetings.listDatemeetingsPerMonth.length > 0) {
						const listDatemeetingsPerMonth = calendarMeetings.listDatemeetingsPerMonth
					
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