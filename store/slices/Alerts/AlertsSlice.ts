import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { TypeItemMessage, TypeAlert } from '../../../components/Alert/Alert.types';
import type { AppState } from '../../store'
import { Constants } from '../../../globals';

const nameSlice = 'alerts';
const initialState: TypeItemMessage[] = [];

const alertsSlices = createSlice({
	name: nameSlice,
	initialState: initialState,
	reducers: {
		add: {
			reducer: (state, action: PayloadAction<TypeItemMessage>) => {
				let preparedMessage: TypeItemMessage;
				const message = action.payload;
				if (!message?.title) message.title = null;
				if (!message?.typeAlert) message.typeAlert = Constants.typeAlert.info;
				if (message?.message) {
					preparedMessage = {id: message.id, message: message.message, title: message.title, typeAlert: message.typeAlert}
					state.push(preparedMessage)
				}
			},
			prepare: (message: string, title?: string, typeAlert?: TypeAlert) => {
				const resultMessage: TypeItemMessage = {id: nanoid(), message}
				if (title && title.length > 0) resultMessage.title = title;
				if (typeAlert && typeAlert.length > 0) resultMessage.typeAlert = typeAlert;
				return {payload: resultMessage};
			}
		},
		removeAll: () => initialState,
		removeMessage: (state, action) => {
			const idMessage: TypeItemMessage["id"] = action.payload;
			const newState = state.filter(itemMessage => itemMessage.id !== idMessage) || [];
			return state = newState;
		}
	}
});

const {add, removeAll, removeMessage} = alertsSlices.actions
const reducer = alertsSlices.reducer

const alertsSelect = (state: AppState) => {
	return state.alerts
}

export {
	add,
	removeAll,
	removeMessage,
	reducer,
	alertsSelect
}