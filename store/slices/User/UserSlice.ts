import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ML } from '../../../globals';
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';
import { LanguageTranslationInterface } from '../../../interfaces';
import { Users } from '../../../models';
import { stringify } from 'querystring';

interface InitialState {
	data: {id: string | null;};
  status: 'idle' | 'loading';
	error: string | null;
}

const initialState: InitialState = {
  data: {id: null},
  status: 'idle',
	error: null,
}

const getIdUserAsync = createAsyncThunk<LanguageTranslationInterface.TextTranslation, LanguageTranslationInterface.TextTranslation | undefined, {dispatch: AppDispatch}>(
  'user/updateUserAsync',
  async (session, {dispatch, rejectWithValue}) => {
		const dataUserBySession = await Users.getBySession(session?.user?.email, session?.user?.image, session?.user?.name)
		
		const idUserSession = dataUserBySession?.data.length > 0 && dataUserBySession?.data[0].id || null;

		if (!idUserSession && session) {
			dispatch(AlertsSlice.add('Ошибка получения данных пользователя', '', 'danger'));
			return rejectWithValue('no idUserSession')
		}
		return idUserSession
  }
)

const UserSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
    builder
      .addCase(getIdUserAsync.pending, (state) => {
        state.status = 'loading'
				state.error = null
      })
      .addCase(getIdUserAsync.rejected, (state, action) => {
				state.status = 'idle'
				const error = 'Ошибка получения данных пользователя'
        state.error = error + ' ' + action.payload
      })
      .addCase(getIdUserAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.data = action.payload
				state.error = null
      })
  },
});

const reducer = UserSlice.reducer

const userSelect = (state: AppState) => {
	return state.user.data
}

export {
	getIdUserAsync,
	reducer,
	userSelect,
}