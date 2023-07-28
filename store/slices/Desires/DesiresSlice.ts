import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { AlertsSlice } from '../../slices';
import {DesiresInterface} from '../../../interfaces'
import { ML } from '../../../globals';
import { Desires } from '../../../models';

interface InitialState {
	entities: DesiresInterface.Desires[];
  status: 'idle' | 'loading';
	error: string | null;
}

const initialState:InitialState = {
  entities: [],
  status: 'idle',
	error: null,
}

const getDesiresByIdMeeting = createAsyncThunk(
  'desires/getDesiresByIdMeeting',
  async (data, {dispatch, rejectWithValue}) => {
		const error = () => {
			const textError = 'Ошибка получения desires'
			dispatch(AlertsSlice.add(textError, data.textTranslation[ML.key.error], 'danger'));
			return rejectWithValue(textError)
		}

		const idMeetings = data.listIdMeetings;

		const listDesiresDb: DesiresInterface.Desires[] = [];
		for await (const idMeeting of idMeetings) {
			const listDesiresByIdMeeting: DesiresInterface.Desires[] = (await Desires.getByIdMeeting(idMeeting))?.data;
			listDesiresByIdMeeting.forEach(desire => {
				if (!listDesiresDb.includes(desire)) {
					listDesiresDb.push(desire);
				}
			});
			listDesiresDb.push();
		}
		
		if (!listDesiresDb) error()
		
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
        state.status = 'loading'
				state.error = null
      })
      .addCase(getDesiresByIdMeeting.rejected, (state, action) => {
				state.status = 'idle'
        state.error = action.payload
      })
      .addCase(getDesiresByIdMeeting.fulfilled, (state, action) => {
        state.status = 'idle'
        state.entities = action.payload
				state.error = null
      })
  },
});

const { addAll, clearAll } = desiresSlices.actions
const reducer = desiresSlices.reducer

const desiresSelect = (state: AppState) => {
	return state.desires.entities
}

export {
	addAll,
	clearAll,
	reducer,
	desiresSelect,
	getDesiresByIdMeeting
}