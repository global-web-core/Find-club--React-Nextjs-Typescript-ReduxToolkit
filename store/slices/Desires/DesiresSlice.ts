import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppDispatch, AppState } from '../../store';
import { AlertsSlice } from '../../slices';
import {DesiresInterface, LanguageTranslationInterface} from '../../../typesAndInterfaces/interfaces'
import { Constants, ML } from '../../../globals';
import { Desires } from '../../../models';

interface InitialState {
	entities: DesiresInterface.Db[];
  status: keyof typeof Constants.statusFetch;
	error: string | null;
}

interface DataForDesiresByIdMeeting {
	textTranslation: LanguageTranslationInterface.Txt,
	listIdMeetings: number[]
}

const initialState:InitialState = {
  entities: [],
  status: Constants.statusFetch.succeeded,
	error: null,
}

const getDesiresByIdMeeting = createAsyncThunk<DesiresInterface.Db[] | undefined, DataForDesiresByIdMeeting, {dispatch: AppDispatch}>(
  'desires/getDesiresByIdMeeting',
  async (data, {dispatch, rejectWithValue}) => {
		const error = () => {
			const textError = 'Ошибка получения desires'
			dispatch(AlertsSlice.add(textError, data.textTranslation[ML.key.error], 'danger'));
			return rejectWithValue(textError)
		}

		const idMeetings = data.listIdMeetings;

		const listDesiresDb: DesiresInterface.Db[] = [];
		for await (const idMeeting of idMeetings) {
			const listDesiresByIdMeeting = (await Desires.getByIdMeeting(idMeeting))?.data;
			if (listDesiresByIdMeeting) {
				listDesiresByIdMeeting.forEach(desire => {
					if (!listDesiresDb.includes(desire)) {
						listDesiresDb.push(desire);
					}
				});
				listDesiresDb.push();
			}
		}
		
		if (!listDesiresDb) return error()
		
		return listDesiresDb;
  }
)

const desiresSlices = createSlice({
	name: 'desires',
	initialState: initialState,
	reducers: {
		addAll: (state, action) => {
			state.entities = action.payload
		},
		clearAll: () => initialState
	},
	extraReducers: (builder) => {
    builder
      .addCase(getDesiresByIdMeeting.pending, (state) => {
        state.status = Constants.statusFetch.loading;
				state.error = null
      })
      .addCase(getDesiresByIdMeeting.rejected, (state, action) => {
				state.status = Constants.statusFetch.failed
        state.error = typeof action.payload === 'string' ? action.payload : 'Error'
      })
      .addCase(getDesiresByIdMeeting.fulfilled, (state, action) => {
				if (action?.payload !== undefined) {
					state.status = Constants.statusFetch.succeeded
					state.entities = action.payload
					state.error = null
				}
      })
  },
});

const { addAll, clearAll } = desiresSlices.actions
const reducer = desiresSlices.reducer

const desiresSelect = (state: AppState) => {
	return state.desires.entities
}

const desiresSelectAllData = (state: AppState) => {
	return state.desires
}

export {
	addAll,
	clearAll,
	reducer,
	desiresSelect,
	desiresSelectAllData,
	getDesiresByIdMeeting
}