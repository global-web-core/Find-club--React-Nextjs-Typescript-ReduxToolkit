import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import {DesiresInterface} from '../../../interfaces'

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

const desiresSlices = createSlice({
	name: 'desires',
	initialState: initialState,
	reducers: {
		addAll: (state, action) => {
			// console.log('--==state', state);
			// console.log('--==action', action);
			state.entities = action.payload
		},
		clearAll: () => initialState
	}
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
	desiresSelect
}