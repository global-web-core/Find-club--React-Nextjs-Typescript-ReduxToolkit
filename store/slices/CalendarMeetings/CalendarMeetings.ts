import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { Helpers, ML } from '../../../globals';

const maxDate =  Helpers.increaseDateByMonths(new Date(), 3);

interface InitialState {
	selectedDay: Date | null;
	maxDate: string;
	// activeStartDateChange: null;
}

// const now = new Date();
const now = new Date();

const initialState:InitialState = {
  selectedDay: null,
	maxDate: Helpers.convertDatetimeLocalForRedux(maxDate),
	activeStartDateChange: null,
	activePeriod: {
		nameMonth: Helpers.getNameMonthByDate(now, ML.getLanguage()),
		start: Helpers.convertDatetimeForRedux(now),
		// end: Helpers.convertDatetimeForRedux(Helpers.getEndMonthByDate(now))
	}
}

const calendarMeetingsSlices = createSlice({
	name: 'calendarMeetings',
	initialState: initialState,
	reducers: {
		setSelectedDay: {
			reducer: (state, action) => {
				state.selectedDay = action.payload
			},
			prepare: (selectedDay) => {
				let date = !selectedDay ? selectedDay : Helpers.convertDatetimeLocalForRedux(selectedDay);
				return {payload: date};
			}
		},
		setActiveStartDateChange: {
			reducer: (state, action) => {
				// console.log('===action', action.payload)
				state.activeStartDateChange = action.payload;
				const activePeriod = {
					nameMonth: Helpers.getNameMonthByDate(action.payload.activeStartDate, ML.getLanguage()),
					start: new Date(action.payload.activeStartDate) > now ? action.payload.activeStartDate : Helpers.convertDatetimeForRedux(now)
				}
				state.activePeriod = activePeriod
			},
			prepare: (dateChange) => {
				const data = {
					action: dateChange.action,
					activeStartDate: Helpers.convertDatetimeAndShiftTimezoneForRedux(dateChange.activeStartDate),
					value: Helpers.convertDatetimeAndShiftTimezoneForRedux(dateChange.value),
					view: dateChange.view,
				};

				return {payload: data};
			}
		},
	}
});

const { setSelectedDay, setActiveStartDateChange } = calendarMeetingsSlices.actions
const reducer = calendarMeetingsSlices.reducer

const selectedDaySelect = (state: AppState) => {
	return state.calendarMeetings.selectedDay
}

const calendarMeetingsSelect = (state: AppState) => {
	return state.calendarMeetings
}

const activeStartDateChangeSelect = (state: AppState) => {
	return state.calendarMeetings.activeStartDateChange
}

export {
	setSelectedDay,
	reducer,
	selectedDaySelect,
	calendarMeetingsSelect,
	activeStartDateChangeSelect,
	setActiveStartDateChange,
}