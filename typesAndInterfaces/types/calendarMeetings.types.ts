import { Constants } from "../../globals";
import { CalendarInterface } from "../interfaces";
import {StatusFetchRedux, ErrorFetchRedux} from '../types';

export type TypeInitialStateCalandarMeeting = {
	selectedDay: string | null;
	maxDate: string;
	activeStartDateChange: CalendarInterface.EventActiveStartDateChangeForRedux | null;
	activePeriod: {nameMonth: string | null, start: string, end: string};
	listDatemeetingsPerMonth: {data: string[], status: keyof typeof Constants.statusFetch, error: string | null}
	status: StatusFetchRedux;
	error: ErrorFetchRedux;
} | Record<string, never>