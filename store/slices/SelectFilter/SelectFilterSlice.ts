import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { Constants } from '../../../globals';

interface InitialState {

};

const initialState:InitialState = {
  basic: Constants.nameBasicFilter.month,
	yourMeetings: Constants.nameYourMeetingsFilter.all
}

const SelectFilterSlice = createSlice({
	name: 'selectFilter',
	initialState: initialState,
	reducers: {
		setYourMeetingsFilter: (state, action) => {
			state.yourMeetings = action.payload;
		},
		setBasicFilterFilter: (state, action) => {
			state.basic = action.payload;
		}
	}
});

const {setYourMeetingsFilter, setBasicFilterFilter} = SelectFilterSlice.actions
const reducer = SelectFilterSlice.reducer

const selectFilter = (state: AppState) => {
	return state.selectFilter
}

export {
	reducer,
	selectFilter,
	setYourMeetingsFilter,
	setBasicFilterFilter
}