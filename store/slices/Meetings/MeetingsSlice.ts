import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AlertsSlice } from '../../slices';
import { AppDispatch, AppState } from '../../store';
import {CountriesInterface, MeetingsInterface, CitiesInterface, InterestsInterface, CategoryInterface, LanguagesInterface, LanguageTranslationInterface} from '../../../typesAndInterfaces/interfaces'
import { Constants, ML } from '../../../globals';
import { ErrorFetchRedux, StatusFetchRedux } from '../../../typesAndInterfaces/types';

interface InitialState {
	entities: MeetingsInterface.MeetingsWithDependentData[];
	listIdMeetings: number[];
  status: StatusFetchRedux;
	error: ErrorFetchRedux;
}

const initialState:InitialState = {
  entities: [],
  listIdMeetings: [],
  status: Constants.statusFetch.succeeded,
	error: null,
}

interface DataForGetMeetingsWithFullDataAsync {
	meetingsDb: MeetingsInterface.Db[],
	listCountries: CountriesInterface.Db[],
	listCities: CitiesInterface.Db[],
	listInterests: InterestsInterface.Db[],
	listCategories: CategoryInterface.Db[],
	listLanguages: LanguagesInterface.Db[],
	textTranslation: LanguageTranslationInterface.Txt 
}

interface GetMeetingsWithFullDataAsync {
	dataMeetings: InitialState["entities"],
	listIdMeetings: InitialState["listIdMeetings"]
}

const getMeetingsWithFullDataAsync = createAsyncThunk<GetMeetingsWithFullDataAsync | undefined, DataForGetMeetingsWithFullDataAsync, {dispatch: AppDispatch}>(
  'meetings/getMeetingsWithFullDataAsync',
  async (data, {dispatch, rejectWithValue}) => {
		const error = () => {
			const textError = data.textTranslation[ML.key.receivingMeeting]
			dispatch(AlertsSlice.add(textError, data.textTranslation[ML.key.error], 'danger'));
			return rejectWithValue(textError)
		}
		
		const getListIdMeetings = (meetings: MeetingsInterface.MeetingsWithDependentData[]) => {
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
			return error();
		}

		return {dataMeetings, listIdMeetings};
  }
)

const meetingsSlices = createSlice({
	name: 'meetings',
	initialState: initialState,
	reducers: {
		addAll: (state, action: PayloadAction<InitialState["entities"]>) => {
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
				state.error = typeof action.payload === 'string' ? action.payload : 'Error'
      })
      .addCase(getMeetingsWithFullDataAsync.fulfilled, (state, action) => {
				if (action?.payload !== undefined) {
					state.status = Constants.statusFetch.succeeded
					state.entities = action.payload.dataMeetings
					state.listIdMeetings = action.payload.listIdMeetings
					state.error = null
				}
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