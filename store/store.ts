import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import * as ListSlices from './slices'

export function makeStore() {
  return configureStore({
    reducer: {
			alerts: ListSlices.AlertsSlice.reducer,
			meetings: ListSlices.MeetingsSlice.reducer,
			desires: ListSlices.DesiresSlice.reducer,
			textTranslation: ListSlices.TextTranslationSlice.reducer,
			basic: ListSlices.BasicSlice.reducer,
			user: ListSlices.UserSlice.reducer,
			selectFilter: ListSlices.SelectFilterSlice.reducer,
			pagination: ListSlices.PaginationSlice.reducer,
		},
		devTools: true
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>
export default store