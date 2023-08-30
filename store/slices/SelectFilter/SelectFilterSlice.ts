import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { Constants } from '../../../globals';
import { SelectFilterInterface } from '../../../typesAndInterfaces/interfaces';

const initialState: SelectFilterInterface.InitialState = {
  basic: Constants.nameBasicFilter.month,
	yourMeetings: Constants.nameYourMeetingsFilter.all
}

const SelectFilterSlice = createSlice({
	name: 'selectFilter',
	initialState: initialState,
	reducers: {
		setYourMeetingsFilter: (state, action: PayloadAction<SelectFilterInterface.InitialState["yourMeetings"]>) => {
			state.yourMeetings = action.payload;
		},
		setBasicFilterFilter: (state, action: PayloadAction<SelectFilterInterface.InitialState["basic"]>) => {
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