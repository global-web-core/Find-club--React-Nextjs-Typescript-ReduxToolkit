import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';

interface InitialState {
	openHamburger: boolean;
}

const initialState:InitialState = {};

const PaginationSlice = createSlice({
	name: 'pagination',
	initialState: initialState,
	reducers: {
		setPagination: (state, action) => {
			if (action.payload.namePagination && action.payload.maxPage > 0) {
				state[action.payload.namePagination] = {maxPage: action.payload.maxPage, currentPage: 1};
			}
		},
		clearAll: () => initialState,
		incrimentPagination: (state, action) => {
			if (Object.prototype.hasOwnProperty.call(state, action.payload)) {
				if (state[action.payload].currentPage < state[action.payload].maxPage) {
					state[action.payload].currentPage = ++state[action.payload].currentPage;
				}
			}
		},
		decrimentPagination: (state, action) => {
			if (Object.prototype.hasOwnProperty.call(state, action.payload)) {
				if (state[action.payload].currentPage > 0) {
					state[action.payload].currentPage = --state[action.payload].currentPage;
				}
			}
		}
	}
});

const { setPagination, incrimentPagination, decrimentPagination, clearAll } = PaginationSlice.actions
const reducer = PaginationSlice.reducer

const paginationSelect = (state: AppState, namePagination) => {
	if (namePagination) return state.pagination[namePagination];	
}

export {
	setPagination,
	clearAll,
	incrimentPagination,
	decrimentPagination,
	reducer,
	paginationSelect
}