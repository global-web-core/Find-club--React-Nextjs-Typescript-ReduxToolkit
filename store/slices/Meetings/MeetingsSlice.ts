import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Meetings } from '../../../models';
import { AlertsSlice } from '../../slices';
import { AppState } from '../../store';
import {MeetingsInterface} from '../../../interfaces'

interface InitialState {
	entities: MeetingsInterface.MeetingsWithDependentData[];
  status: 'idle' | 'loading';
	error: string | null;
}

const initialState:InitialState = {
  entities: [],
  status: 'idle',
	error: null,
}

const getMeetingsAsync = createAsyncThunk(
  'meetings/getMeetings',
  async (_, {dispatch, rejectWithValue}) => {
		const response = await Meetings.getAll()
		if (!response) {
			dispatch(AlertsSlice.add('Ошибка загрузки встреч', '', 'danger'));
			return rejectWithValue('no get Meetings.getAll')
		}
		return response.data
  }
)

const meetingsSlices = createSlice({
	name: 'meetings',
	initialState: initialState,
	reducers: {
		addAll: (state, action) => {
			// console.log('--==state', state);
			// console.log('--==action', action);
			state.entities = action.payload
		},
		clearAll: () => initialState
	},
	extraReducers: (builder) => {
    builder
      .addCase(getMeetingsAsync.pending, (state) => {
        state.status = 'loading'
				state.error = null
      })
      .addCase(getMeetingsAsync.rejected, (state, action) => {
				state.status = 'idle'
				const error = 'Ошибка загрузки встреч'
        state.error = error + ' ' + action.payload
      })
      .addCase(getMeetingsAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.entities = action.payload
				state.error = null
      })
  },
});

const { addAll, clearAll } = meetingsSlices.actions
const reducer = meetingsSlices.reducer

const meetingsSelect = (state: AppState) => {
	return state.meetings.entities
}


export {
	addAll,
	clearAll,
	getMeetingsAsync,
	reducer,
	meetingsSelect
}