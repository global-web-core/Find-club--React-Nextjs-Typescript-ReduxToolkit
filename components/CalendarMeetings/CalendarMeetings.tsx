import React, { useEffect, useState } from 'react';
import styles from './CalendarMeetings.module.css';
import { CalendarMeetingsProps } from './CalendarMeetings.props';
import Calendar from 'react-calendar'
import { CalendarMeetingsSlice, MeetingsSlice, SelectFilterSlice } from '../../store/slices';
import { Constants, Helpers } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../store/hook';

export const CalendarMeetings = ({language, ...props}: CalendarMeetingsProps):JSX.Element => {
	const dispatch = useAppDispatch();
	const selectedDayCalendar = useAppSelector(state => CalendarMeetingsSlice.selectedDaySelect(state));
	const selectedDay = Helpers.convertFromReduxToDatetimeLocal(selectedDayCalendar);
	const calendarMeetings = useAppSelector(state => CalendarMeetingsSlice.calendarMeetingsSelect(state));
	const activeStartDateChange = useAppSelector(state => CalendarMeetingsSlice.activeStartDateChangeSelect(state));

	const meetings = useAppSelector(state => MeetingsSlice.meetingsSelect(state));
	const [dateMeetingsForMonth, setDateMeetingsForMonth] = useState([]);
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));

	// const maxDate = Helpers.increaseDateByMonths(new Date(), 3);
	const maxDate = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.maxDate);

	const changeSelectedDay = (e) => {
		console.log('===changeSelectedDay', e)
		if (!e && activeStartDateChange) {
			console.log('===activeStartDateChange', activeStartDateChange)
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

	// const getActivePeriodMonth = () => {
	// 	let today = new Date();
	// 	let start = today;
	// 	let end;

	// 	if (activeStartDateChange) {
	// 		if (activeStartDateChange?.activeStartDate > today) {
	// 			start = activeStartDateChange?.activeStartDate;
	// 		}
	// 	}
	// 	let endMonth = new Date(Helpers.getEndMonthByDate(start));
	// 	end = endMonth < maxDate ? endMonth : maxDate;

	// 	return {start, end};
	// }

	// const addDateMeetingsForMonth = () => {
	// 	const activePeriod = getActivePeriodMonth();
	// 	console.log('===activePeriod', activePeriod)

	// 	// console.log('===listMeetings', listMeetings)
	// 	// if (listMeetings && selectFilter.basic === Constants.nameBasicFilter.month) {
	// 	// 	const dateMark = meetings.find(meeting => {
	// 	// 		const meetingDate = new Date(meeting.dateMeeting);
	// 	// 		if (date.getYear() === meetingDate.getYear() && date.getMonth() === meetingDate.getMonth() && date.getDate() === meetingDate.getDate()) return true;
	// 	// 	});
			
	// 	// 	return dateMark ? 'highlight' : '';
	// 	// }

	// 	// setDateMeetings();
	// }

	return (
		<>
			<Calendar
				onChange={changeSelectedDay} value={selectedDay}
				minDate={new Date()} maxDate={new Date(maxDate)}
				minDetail={"month"} maxDetail={"month"}
				locale={language}
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
				{...props}
			/>
		</>
	);
};