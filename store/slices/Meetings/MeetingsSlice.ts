import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AlertsSlice } from '../../slices';
import { AppState } from '../../store';
import {MeetingsInterface} from '../../../interfaces'
import { Constants, ML } from '../../../globals';

interface InitialState {
	entities: MeetingsInterface.MeetingsWithDependentData[];
  status: Constants.statusFetch.succeeded | Constants.statusFetch.failed | Constants.statusFetch.loading;
	error: string | null;
}

const initialState:InitialState = {
  entities: [],
  listIdMeetings: [],
  status: Constants.statusFetch.succeeded,
	error: null,
}

const getMeetingsWithFullDataAsync = createAsyncThunk(
  'meetings/getMeetingsWithFullDataAsync',
  async (data, {dispatch, rejectWithValue}) => {
		const error = () => {
			const textError = data.textTranslation[ML.key.receivingMeeting]
			dispatch(AlertsSlice.add(textError, data.textTranslation[ML.key.error], 'danger'));
			return rejectWithValue(textError)
		}
		
		const getListIdMeetings = (meetings) => {
			const idMeetings: number[] = [];
			for (let index = 0; index < meetings.length; index++) {
				if (!idMeetings.includes(meetings[index]?.id)) idMeetings.push(meetings[index]?.id);
			}
			return idMeetings;
		}

		const dataMeetings: MeetingsInterface.MeetingsWithDependentData[] = [];

		if (data.meetingsDb.length > 0) {
			data.meetingsDb.forEach((meeting) => {
				const country = data.listCountries.find(country => country.id === meeting.idCountry);
				const city = data.listCities.find(city => city.id === meeting.idCity);
				const interest = data.listInterests.find(interest => interest.id === meeting.idInterest);
				const category = data.listCategories.find(category => category.id === meeting.idCategory);
				const language = data.listLanguages.find(language => language.id === meeting.idLanguage);
				if (country?.route && city?.route && interest?.route && category?.route && language?.name) {
					const dataMeeting: MeetingsInterface.MeetingsWithDependentData = {
						id: meeting.id,
						country: data.textTranslation[country.route],
						city: data.textTranslation[city.route],
						interest: data.textTranslation[interest.route],
						category: data.textTranslation[category.route],
						language: language.name,
						placeMeeting: meeting.placeMeeting,
						dateMeeting: meeting.dateMeeting,
						typeMeeting: meeting.typeMeeting,
						accessMeeting: meeting.accessMeeting,
						status: meeting.status
					};

					if (!dataMeetings.includes(dataMeeting)) dataMeetings.push(dataMeeting);
				}
			});
		}
		const listIdMeetings = getListIdMeetings(dataMeetings);
		
		if (!dataMeetings && !listIdMeetings) {
			error();
			return;
		}
		return {dataMeetings, listIdMeetings};
  }
)

const meetingsSlices = createSlice({
	name: 'meetings',
	initialState: initialState,
	reducers: {
		addAll: (state, action) => {
			state.entities = action.payload
		},
		clearAll: () => initialState
	},
	extraReducers: (builder) => {
    builder
      .addCase(getMeetingsWithFullDataAsync.pending, (state) => {
        state.status = Constants.statusFetch.loading
				state.error = null
      })
      .addCase(getMeetingsWithFullDataAsync.rejected, (state, action) => {
				state.status = Constants.statusFetch.failed
        state.error = action.payload
      })
      .addCase(getMeetingsWithFullDataAsync.fulfilled, (state, action) => {
        state.status = Constants.statusFetch.succeeded
        state.entities = action.payload.dataMeetings
        state.listIdMeetings = action.payload.listIdMeetings
				state.error = null
      })
  },
});

const { addAll, clearAll } = meetingsSlices.actions
const reducer = meetingsSlices.reducer

const meetingsSelect = (state: AppState) => {
	return state.meetings.entities
}

const meetingsSelectAllData = (state: AppState) => {
	return state.meetings
}

const listIdMeetingsSelect = (state: AppState) => {
	return state.meetings.listIdMeetings
}

export {
	addAll,
	clearAll,
	getMeetingsWithFullDataAsync,
	reducer,
	meetingsSelect,
	meetingsSelectAllData,
	listIdMeetingsSelect
}