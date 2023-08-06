import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { Helpers, ML } from '../../../globals';

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
	listDatemeetingsPerMonth: []
}

const setListDatemeetingsPerMonthAsync = createAsyncThunk<LanguageTranslationInterface.TextTranslation, LanguageTranslationInterface.TextTranslation | undefined, {dispatch: AppDispatch}>(
  'calendarMeetings/setListDatemeetingsPerMonthAsync',
  async (listDate, {dispatch, rejectWithValue}) => {
		const listResult = [];
		listDate.forEach(date => {
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
		// setListDatemeetingsPerMonth: {
		// 	reducer: (state, action) => {
		// 		state.listDatemeetingsPerMonth = action.payload
		// 	},
		// 	prepare: (listDate) => {
		// 		const listResult = [];
		// 		listDate.forEach(date => {
		// 			if (typeof date === 'object') listResult.push(Helpers.convertDatetimeLocalForRedux(date))
		// 		});
		// 		return {payload: listResult};
		// 	}
		// },
	},
	extraReducers: (builder) => {
    builder
      .addCase(setListDatemeetingsPerMonthAsync.pending, (state) => {
        // state.status = Constants.statusFetch.loading
				// state.error = null
      })
      .addCase(setListDatemeetingsPerMonthAsync.rejected, (state, action) => {
				// state.status = Constants.statusFetch.failed
        // state.error = action.payload
      })
      .addCase(setListDatemeetingsPerMonthAsync.fulfilled, (state, action) => {
				// console.log('===action', action.payload)
        // state.status = Constants.statusFetch.succeeded
        // state.entities = action.payload.dataMeetings
        // state.listIdMeetings = action.payload.listIdMeetings
				// state.error = null
				state.listDatemeetingsPerMonth = action.payload
      })
  },
});

const { setSelectedDay, setActiveStartDateChange, setListDatemeetingsPerMonth } = calendarMeetingsSlices.actions
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
	// setListDatemeetingsPerMonth,
	setListDatemeetingsPerMonthAsync
}