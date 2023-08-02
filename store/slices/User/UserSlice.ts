import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';
import { LanguageTranslationInterface } from '../../../interfaces';
import { Users } from '../../../models';
import { Constants } from '../../../globals';

interface InitialState {
	data: {id: string | null;};
  status: Constants.statusFetch.succeeded | Constants.statusFetch.failed | Constants.statusFetch.loading;
	error: string | null;
}

const initialState: InitialState = {
  data: {id: null},
  status: Constants.statusFetch.succeeded,
	error: null,
}

const getIdUserAsync = createAsyncThunk<LanguageTranslationInterface.TextTranslation, LanguageTranslationInterface.TextTranslation | undefined, {dispatch: AppDispatch}>(
  'user/updateUserAsync',
  async (session, {dispatch, rejectWithValue}) => {
		const dataUserBySession = await Users.getBySession(session?.user?.email, session?.user?.image, session?.user?.name)
		
		const idUserSession = dataUserBySession?.data.length > 0 && dataUserBySession?.data[0].id || null;

		if (!idUserSession && session) {
			const textError = 'Ошибка получения данных пользователя';
			dispatch(AlertsSlice.add(textError, '', 'danger'));
			return rejectWithValue(textError)
		}
		return idUserSession
  }
)

const UserSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		clearAll: () => initialState
	},
	extraReducers: (builder) => {
    builder
      .addCase(getIdUserAsync.pending, (state) => {
        state.status = Constants.statusFetch.loading
				state.error = null
      })
      .addCase(getIdUserAsync.rejected, (state, action) => {
				state.status = Constants.statusFetch.failed
        state.error = action.payload
      })
      .addCase(getIdUserAsync.fulfilled, (state, action) => {
        state.status = Constants.statusFetch.succeeded
        state.data = action.payload
				state.error = null
      })
  },
});

const { clearAll } = UserSlice.actions
const reducer = UserSlice.reducer

const userSelect = (state: AppState) => {
	return state.user.data
}

export {
	getIdUserAsync,
	reducer,
	userSelect,
	clearAll
}