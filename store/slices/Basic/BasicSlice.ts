import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';

interface InitialState {
	openHamburger: boolean;
}

const initialState:InitialState = {
  openHamburger: false,
}

const basicSlices = createSlice({
	name: 'basic',
	initialState: initialState,
	reducers: {
		changeOpenHamburger: (state) => {
			state.openHamburger = !state.openHamburger
		}
	}
});

const { changeOpenHamburger } = basicSlices.actions
const reducer = basicSlices.reducer

const basicSelect = (state: AppState) => {
	return state.basic.openHamburger
}

export {
	changeOpenHamburger,
	reducer,
	basicSelect
}