import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppState } from '../../store';
import { Constants } from '../../../globals';
import { TypeNamePagination } from '../../../typesAndInterfaces/types';

type ListNamePagination = keyof typeof Constants.namePagination

type Pagination = {
	maxPage: number;
	currentPage: number;
}

type InitialState = Record<string, never> | {
	[key in ListNamePagination]?: Pagination
}

type SetPagination = {
	namePagination: ListNamePagination,
	maxPage: Pagination["maxPage"]
}

const nameSlice = "pagination";
const initialState: InitialState = {};

const PaginationSlice = createSlice({
	name: nameSlice,
	initialState: initialState,
	reducers: {
		setPagination: (state, action: PayloadAction<SetPagination>) => {
			if (action.payload.namePagination && action.payload.maxPage > 0) {
				state[action.payload.namePagination] = {maxPage: action.payload.maxPage, currentPage: 1};
			}
		},
		clearAll: () => initialState,
		incrimentPagination: (state, action: PayloadAction<ListNamePagination>) => {
			if (Object.prototype.hasOwnProperty.call(state, action.payload)) {
				const pagination = state[action.payload];
				if (pagination && pagination.currentPage < pagination.maxPage) {
					pagination.currentPage = ++pagination.currentPage;
				}
			}
		},
		decrimentPagination: (state, action: PayloadAction<ListNamePagination>) => {
			if (Object.prototype.hasOwnProperty.call(state, action.payload)) {
				const pagination = state[action.payload];
				if (pagination && pagination.currentPage > 0) {
					pagination.currentPage = --pagination.currentPage;
				}
			}
		}
	}
});

const { setPagination, incrimentPagination, decrimentPagination, clearAll } = PaginationSlice.actions
const reducer = PaginationSlice.reducer

const paginationSelect = (state: AppState, namePagination: TypeNamePagination) => {
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