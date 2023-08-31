import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Constants, ML } from '../../../globals';
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';
import { LanguageTranslationInterface } from '../../../typesAndInterfaces/interfaces';
import { ErrorFetchRedux, StatusFetchRedux } from '../../../typesAndInterfaces/types';

interface InitialState {
	entities: LanguageTranslationInterface.Txt;
  status: StatusFetchRedux;
	error: ErrorFetchRedux;
}

const nameSlice = "textTranslation";
const nameAsyncActionUpdateLanguageAsync = "updateLanguageAsync";
const initialState: InitialState = {
  entities: {},
  status: Constants.statusFetch.succeeded,
	error: null,
}

const updateLanguageAsync = createAsyncThunk<LanguageTranslationInterface.Txt, LanguageTranslationInterface.Txt | undefined, {dispatch: AppDispatch}>(
  nameSlice + '/' + nameAsyncActionUpdateLanguageAsync,
  async (text, {dispatch, rejectWithValue}) => {
		const textDb = text ? text : await ML.getTranslationText();
		const currentTranslationText = await ML.getChangeTranslationText(textDb)
		if (!currentTranslationText) {
			dispatch(AlertsSlice.add(Constants.errorLoadingText, '', Constants.typeAlert.danger));
			return rejectWithValue(Constants.errorLoadingText)
		}
		return currentTranslationText
  }
)

const textTranslationSlices = createSlice({
	name: nameSlice,
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
    builder
      .addCase(updateLanguageAsync.pending, (state) => {
        state.status = Constants.statusFetch.loading
				state.error = null
      })
      .addCase(updateLanguageAsync.rejected, (state, action) => {
				state.status = Constants.statusFetch.failed
        state.error = typeof action.payload === 'string' ? action.payload : Constants.error
      })
      .addCase(updateLanguageAsync.fulfilled, (state, action) => {
        state.status = Constants.statusFetch.succeeded
        state.entities = action.payload
				state.error = null
      })
  },
});

const reducer = textTranslationSlices.reducer

const textTranslationSelect = (state: AppState) => {
	return state.textTranslation.entities
}

export {
	updateLanguageAsync,
	reducer,
	textTranslationSelect,
}