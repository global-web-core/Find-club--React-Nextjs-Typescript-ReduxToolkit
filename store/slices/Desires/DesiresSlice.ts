import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppDispatch, AppState } from '../../store';
import { AlertsSlice } from '../../slices';
import {DesiresInterface, LanguageTranslationInterface} from '../../../typesAndInterfaces/interfaces'
import { Constants, ML } from '../../../globals';
import { Desires } from '../../../models';
import { ErrorFetchRedux, StatusFetchRedux } from '../../../typesAndInterfaces/types';

interface InitialState {
	entities: DesiresInterface.Db[];
  status: StatusFetchRedux;
	error: ErrorFetchRedux;
}

interface DataForDesiresByIdMeeting {
	textTranslation: LanguageTranslationInterface.Txt,
	listIdMeetings: number[]
}

const nameSlice = "desires";
const nameAsyncActionGetDesiresByIdMeeting = "getDesiresByIdMeeting";
const initialState:InitialState = {
  entities: [],
  status: Constants.statusFetch.succeeded,
	error: null,
}

const getDesiresByIdMeeting = createAsyncThunk<DesiresInterface.Db[] | undefined, DataForDesiresByIdMeeting, {dispatch: AppDispatch}>(
  nameSlice + '/' + nameAsyncActionGetDesiresByIdMeeting,
  async (data, {dispatch, rejectWithValue}) => {
		const error = () => {
			const textError = data.textTranslation[ML.key.errorReceivingParticipants] || data.textTranslation[ML.key.error]
			dispatch(AlertsSlice.add(textError, data.textTranslation[ML.key.error], Constants.typeAlert.danger));
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
	name: nameSlice,
	initialState: initialState,
	reducers: {
		addAll: (state, action: PayloadAction<InitialState["entities"]>) => {
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
        state.error = typeof action.payload === 'string' ? action.payload : Constants.error
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