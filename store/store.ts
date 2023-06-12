import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { AlertsSlice, MeetingsSlice, DesiresSlice, TextTranslationSlice } from './slices'

export function makeStore() {
  return configureStore({
    reducer: {
			alerts: AlertsSlice.reducer,
			meetings: MeetingsSlice.reducer,
			desires: DesiresSlice.reducer,
			textTranslation: TextTranslationSlice.reducer,
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