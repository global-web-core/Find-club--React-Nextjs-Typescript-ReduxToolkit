import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ML } from '../../../globals';
import { AlertsSlice } from '../../slices';
import { AppState, AppDispatch } from '../../store';

interface TranslationText {[key: string]: string}

interface InitialState {
	entities: TranslationText;
  status: 'idle' | 'loading';
	error: string | null;
}

const initialState: InitialState = {
  entities: {},
  status: 'idle',
	error: null,
}

const updateLanguageAsync = createAsyncThunk<TranslationText, undefined, {dispatch: AppDispatch}>(
  'textTranslation/updateLanguageAsync',
  async (_, {dispatch}) => {
		const textDb = await ML.getTranslationText();
		const currentTranslationText = await ML.getChangeTranslationText(textDb, null)

		if (!currentTranslationText) dispatch(AlertsSlice.add('Ошибка загрузки переведенного текста', '', 'danger'));
		console.log
		return currentTranslationText as TranslationText

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
      .addCase(updateLanguageAsync.rejected, (state) => {
				state.status = 'idle'
				const error = 'Ошибка загрузки встреч'
        state.error = error
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