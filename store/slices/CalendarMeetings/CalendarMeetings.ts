import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { Constants, Helpers, ML } from '../../../globals';
import { Meetings } from '../../../models';

const maxDate =  Helpers.increaseDateByMonths(new Date(), 3);

interface InitialState {
	selectedDay: Date | null;
	maxDate: string;
	// activeStartDateChange: null;
}

const now = new Date();

const initialState:InitialState = {
  selectedDay: null,
	maxDate: Helpers.convertDatetimeLocalForRedux(maxDate),
	activeStartDateChange: null,
	activePeriod: {
		nameMonth: Helpers.getNameMonthByDate(now, ML.getLanguage()),
		start: Helpers.convertDatetimeForRedux(Helpers.getStartDayByDate(now)),
		end: Helpers.convertDatetimeForRedux(Helpers.getEndMonthByDate(now))
	},
	listDatemeetingsPerMonth: {data: [], status: Constants.statusFetch.succeeded, error: null,}
}

const setListDatemeetingsPerMonthAsync = createAsyncThunk<LanguageTranslationInterface.TextTranslation, LanguageTranslationInterface.TextTranslation | undefined, {dispatch: AppDispatch}>(
  'calendarMeetings/setListDatemeetingsPerMonthAsync',
  async (parametersRequest, {getState}) => {
		const {calendarMeetings} =  getState();

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
	
			const meetingDb = await Meetings.getOneByDateMeetingsAndCountry(parametersRequest.country, startDay, endDay);
			if (meetingDb && meetingDb.data.length > 0) listDatemeetingsPerMonth.push(date)
		}

		const listResult = [];
		listDatemeetingsPerMonth.forEach(date => {
			if (typeof date === 'object') listResult.push(Helpers.convertDatetimeLocalForRedux(date))
		});

		return listResult;
  }
)

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
				const activeStartDate = new Date(action.payload.activeStartDate);
				const startPeriod = activeStartDate > now ? Helpers.getStartDayByDate(activeStartDate) : Helpers.getStartDayByDate(now);
				const endMonth = Helpers.getEndMonthByDate(activeStartDate);
				const endPeriod = endMonth < new Date(state.maxDate) ? endMonth : new Date(state.maxDate);

				const activePeriod = {
					nameMonth: Helpers.getNameMonthByDate(activeStartDate, ML.getLanguage()),
					start: Helpers.convertDatetimeForRedux(startPeriod),
					end: Helpers.convertDatetimeForRedux(endPeriod)
				}

				state.activePeriod = activePeriod;
				state.activeStartDateChange = action.payload;
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
	},
	extraReducers: (builder) => {
    builder
      .addCase(setListDatemeetingsPerMonthAsync.pending, (state, action) => {
				state.status = Constants.statusFetch.loading
				state.error = null
      })
      .addCase(setListDatemeetingsPerMonthAsync.rejected, (state, action) => {
				state.status = Constants.statusFetch.failed
        state.error = action.payload
      })
      .addCase(setListDatemeetingsPerMonthAsync.fulfilled, (state, action) => {
        state.status = Constants.statusFetch.succeeded
				state.error = null
				state.listDatemeetingsPerMonth.data = action.payload
      })
  },
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
	setListDatemeetingsPerMonthAsync
}