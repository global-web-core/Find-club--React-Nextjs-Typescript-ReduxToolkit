import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ML } from '../../../globals';
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';
import { LanguageTranslationInterface } from '../../../interfaces';

interface InitialState {
	entities: LanguageTranslationInterface.TextTranslation;
  status: 'idle' | 'loading';
	error: string | null;
}

const initialState: InitialState = {
  entities: {},
  status: 'idle',
	error: null,
}

const updateLanguageAsync = createAsyncThunk<LanguageTranslationInterface.TextTranslation, LanguageTranslationInterface.TextTranslation | undefined, {dispatch: AppDispatch}>(
  'textTranslation/updateLanguageAsync',
  async (text, {dispatch, rejectWithValue}) => {
		const textDb = text ? text : await ML.getTranslationText();
		const currentTranslationText = await ML.getChangeTranslationText(textDb)

		if (!currentTranslationText) {
			dispatch(AlertsSlice.add('Ошибка загрузки переведенного текста', '', 'danger'));
			return rejectWithValue('no get ML.getTranslationText')
		}
		console.log
		return currentTranslationText as LanguageTranslationInterface.TextTranslation
  }
)

const textTranslationSlices = createSlice({
	name: 'textTranslation',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
    builder
      .addCase(updateLanguageAsync.pending, (state) => {
        state.status = 'loading'
				state.error = null
      })
      .addCase(updateLanguageAsync.rejected, (state, action) => {
				state.status = 'idle'
				const error = 'Ошибка загрузки переведенного текста'
        state.error = error + ' ' + action.payload
      })
      .addCase(updateLanguageAsync.fulfilled, (state, action) => {
        state.status = 'idle'
        state.entities = action.payload
				state.error = null
      })
  },
});

// const { updateLanguage } = textTranslationSlices.actions
const reducer = textTranslationSlices.reducer

const textTranslationSelect = (state: AppState) => {
	return state.textTranslation.entities
}

export {
	updateLanguageAsync,
	reducer,
	textTranslationSelect,
}