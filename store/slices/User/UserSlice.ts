import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';
import { LanguageTranslationInterface, UsersInterface } from '../../../typesAndInterfaces/interfaces';
import { ErrorFetchRedux, StatusFetchRedux, TypeEmail, TypeImage, TypeName } from '../../../typesAndInterfaces/types';
import { Users } from '../../../models';
import { Constants, ML } from '../../../globals';

interface InitialState {
	data: {id: UsersInterface.Db["id"] | null};
  status: StatusFetchRedux;
	error: ErrorFetchRedux;
}

interface DataForGetIdUserAsync {
	email: TypeEmail,
	image: TypeImage,
	name: TypeName,
	textTranslation: LanguageTranslationInterface.Txt,
}

const initialState: InitialState = {
  data: {id: null},
  status: Constants.statusFetch.succeeded,
	error: null,
}

const getIdUserAsync = createAsyncThunk<UsersInterface.Db["id"], DataForGetIdUserAsync, {dispatch: AppDispatch}>(
  'user/updateUserAsync',
  async (data, {dispatch, rejectWithValue}) => {
		const dataUserBySession = await Users.getBySession(data.email, data.image, data.name)
		
		const idUserSession = dataUserBySession?.data?.length && dataUserBySession?.data[0]?.id || null;
		if (!idUserSession) {
			const textError = 'Ошибка получения данных пользователя';
			dispatch(AlertsSlice.add(textError, data.textTranslation[ML.key.error], 'danger'));
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
        state.error = typeof action.payload === 'string' ? action.payload : 'Error'
      })
      .addCase(getIdUserAsync.fulfilled, (state, action) => {
        state.status = Constants.statusFetch.succeeded
        state.data.id = action.payload
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