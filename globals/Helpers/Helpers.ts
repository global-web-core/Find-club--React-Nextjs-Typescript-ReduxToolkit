import { Constants } from "..";
import {ML} from '../../globals';
import { CountriesInterface, LanguagesInterface, SelectFilterInterface } from "../../typesAndInterfaces/interfaces";
import { TypeInitialStateCalandarMeeting, TypeLanguages } from "../../typesAndInterfaces/types";

const copyOfDateInStringTimezoneUTC = (date: Date): string | undefined => {
	if (typeof date === 'object') return JSON.parse(JSON.stringify(date))
}

const convertDatetimeForRedux = (date: Date) => {
	if (typeof date === 'object') return copyOfDateInStringTimezoneUTC(date);
}

const convertFromReduxToDatetime = (date: string) => {
	if (typeof date === 'string') {
		const dateTimeLocal = new Date(date);
		if (typeof dateTimeLocal === 'object') {
			return dateTimeLocal;
		}
	}
}

const convertDatetimeForDb = (date: Date) => {
	if (typeof date === 'object') {
		return date.toISOString().replace('T', ' ').replace('Z', '');
	}
}

const removeFromDatetimeTAndZ = (date: string) => {
	if (typeof date === 'string') {
		return date.replace('T', ' ').replace('Z', '');
	}
}

const convertDatetimeLocalForDb = (date: Date) => {
	if (typeof date === 'object') {
		return new Date(date).toISOString().replace('T', ' ').replace('Z', '');
	}
}

const currentDatetimeForDb = () => {
	return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

const currentDatetimeDbToDatetimeLocal = (date: string) => {
	if (typeof date === 'string') {
		const dateTimeUtsTZ = date.replace(/\s/g,'T') + 'Z';
		return new Date(dateTimeUtsTZ);
	}
}

const currentDatetimeDbToDatetimeLocalString = (date: string) => {
	if (typeof date === 'string') {
		const changeDate = currentDatetimeDbToDatetimeLocal(date);
		if (changeDate) return changeDate.toLocaleString();
	}
}

const convertDatetimeLocalForRedux = (date: Date | null) => {
	if (!date) return date
	const datetimeForRedux = convertDatetimeForRedux(date);
	if (typeof datetimeForRedux === 'string') {
		return datetimeForRedux;
	}
}

const removeTimezoneShiftDateToTimezone = (date: Date) => {
	if (typeof date === 'object') {
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		const hour = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();
		const dateWithoutTimezone = new Date (Date.UTC(year, month, day, hour, minutes, seconds));
		return dateWithoutTimezone;
	}
}

const getDatetimeLocalToStringShiftDateToUtc = (date: string) => {
	if (typeof date === 'string') {
		const datetimeLocal = removeFromDatetimeTAndZ(date);
		if (typeof datetimeLocal === 'string') return datetimeLocal;
	}
}

const convertDatetimeAndShiftTimezoneForRedux = (date: Date): string | null | undefined => {
	if (!date) return date
	const dateTimeNewCopy = copyOfDateInStringTimezoneUTC(date);
	if (dateTimeNewCopy) {
		const dateShiftTimezone = removeTimezoneShiftDateToTimezone(new Date (dateTimeNewCopy));
		if (dateShiftTimezone) {
			const datetimeForRedux = convertDatetimeForRedux(dateShiftTimezone);
			if (typeof datetimeForRedux === 'string') {
				return datetimeForRedux;
			}
		}
	}
}

const convertFromReduxToDatetimeLocal = (date: string): Date | undefined => {
	if (!date) return;
	if (typeof date === 'string') {
		return convertFromReduxToDatetime(date);
	}
}

const convertFromReduxToDatetimeLocalAndShiftTimezone = (date: string) => {
	if (!date) return;
	const dateShiftTimezone = getDatetimeLocalToStringShiftDateToUtc(date);
	if (dateShiftTimezone) return convertFromReduxToDatetime(dateShiftTimezone);
}

const filterPastDate = (list: any[], nameFilterColumn: string) => {
	if (list.length > 0) {
		const filteresList = list.filter(item => {
			const currentDateTime = new Date();
			const dateTimeFromList = currentDatetimeDbToDatetimeLocal(item[nameFilterColumn]);
			if (dateTimeFromList) {
				return currentDateTime >= dateTimeFromList;
			}
		});
		return filteresList;
	}
}

const randomGenerateLetterAndNumber = (length: number) => {
	let result = '';
	const characters = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';
	const charactersLength = characters.length;
	const numbersLength = numbers.length;
	let counter = 0;
	while (counter < length) {
		if (counter % 3 === 0 && counter !== 0) {
			result += numbers.charAt(Math.floor(Math.random() * numbersLength));
		} else {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		counter += 1;
	}
	return result;
}

const calculateCountPageByCountRows = (countRows: number) => {
	if (countRows && countRows > 0) {
		const countPage = Math.ceil(countRows / Constants.pagination.limit);
		return countPage;
	}
}

const increaseDateByMonths = (date: Date, countMonths: number) => {
	if (date && countMonths) {
		const dateTimeNewCopyInString = copyOfDateInStringTimezoneUTC(date);
		const newIndependentDate = dateTimeNewCopyInString && new Date(dateTimeNewCopyInString);
		if (newIndependentDate) {
			const incrementedMonths = new Date(newIndependentDate.setMonth(newIndependentDate.getMonth()+countMonths));
			const incrementedDate = new Date(incrementedMonths.setHours(23, 59, 59, 999));
			return incrementedDate;
		}
	}
};

const getStartDayByDate = (date: Date) => {
	if (date) {
		return new Date(date.setHours(0, 0, 0, 0));
	}
};

const getEndDayByDate = (date: Date) => {
	if (date) {
		return new Date(date.setHours(23, 59, 59, 999));
	}
};

const getEndMonthByDate = (date: Date) => {
	if (date) {
		return new Date(date.getFullYear(), date.getMonth()+1, 0, 23, 59, 59, 999);
	}
};

const getNameMonthByDate = (date: Date | string, language: TypeLanguages) => {
	if (typeof date === 'string' && language) {
		const nameMonthByDate = new Date(date).toLocaleString(language, { month: 'long' });
		if (nameMonthByDate) return nameMonthByDate;
	}
	if (typeof date === 'object' && language) {
		const nameMonthByDate = date.toLocaleString(language, { month: 'long' });
		if (nameMonthByDate) return nameMonthByDate;
	}
	return null;
}

const getNameDayByDate = (date: string) => {
	if (typeof date === 'string') {
		const dateTimeLocal = new Date(date);
		if (typeof dateTimeLocal === 'object') {
			return dateTimeLocal.toLocaleDateString();
		}
	}
}

const getUrlCountry = (pathCountry: string, countries: CountriesInterface.Db[], languages: LanguagesInterface.Db[]) => {
	let urlCountry = pathCountry;
	if (urlCountry) {
		const settingLanguage = ML.getLanguage();
		const currentCountry = countries.find(country => country.route === urlCountry);
		const currentLanguage = languages.find((language: LanguagesInterface.Db) => currentCountry && language.idCountry === currentCountry.id);
		if (!settingLanguage && currentLanguage) ML.setLanguage(currentLanguage.route);

		urlCountry = urlCountry + ML.addInPathLanguage(settingLanguage, currentLanguage, urlCountry);

		return urlCountry;
	}
	return null;
}

const getStartDateAndEndDateBySelectFilter = (selectFilter: SelectFilterInterface.InitialState, calendarMeetings: TypeInitialStateCalandarMeeting, activeStartDateChange: TypeInitialStateCalandarMeeting["activeStartDateChange"], selectedDay: Date | undefined) => {
	if (selectFilter.basic === Constants.nameBasicFilter.month) {
		const startDate = calendarMeetings.activePeriod.start;
		const endDate = calendarMeetings.activePeriod.end;

		return {startDate, endDate};
	}

	if (selectFilter.basic === Constants.nameBasicFilter.day) {
		const newDate = new Date();
		let currentDate;
		if (activeStartDateChange && !selectedDay) {
			let activeStartDate: Date | undefined;
			if (activeStartDateChange?.activeStartDate) activeStartDate = convertFromReduxToDatetimeLocalAndShiftTimezone(activeStartDateChange?.activeStartDate);
			if (activeStartDate && activeStartDate > newDate) {
				currentDate = activeStartDate;
			} else {
				currentDate = newDate;
			}
		} else if (selectedDay) {
			currentDate = selectedDay;
		} else {
			currentDate = newDate;
		}
		const startDayByDate = getStartDayByDate(currentDate);
		const startDay = startDayByDate && convertDatetimeLocalForDb(startDayByDate);
		const endDay = getEndDayByDate(currentDate);
		const lastDate = endDay && convertDatetimeLocalForDb(endDay);
		const startDate = startDay;
		const endDate = lastDate;

		return {startDate, endDate, selectedDay: currentDate};
	}
}

const getCountryByUrlCountry = (urlCountry: string) => {
	if (typeof urlCountry === 'string') {
		return urlCountry.slice(0,2);
	}
}

export {
	convertDatetimeForDb,
	convertDatetimeLocalForDb,
	currentDatetimeForDb,
	randomGenerateLetterAndNumber,
	currentDatetimeDbToDatetimeLocal,
	currentDatetimeDbToDatetimeLocalString,
	filterPastDate,
	calculateCountPageByCountRows,
	increaseDateByMonths,
	getStartDayByDate,
	getEndDayByDate,
	getEndMonthByDate,
	getNameMonthByDate,
	convertDatetimeLocalForRedux,
	convertFromReduxToDatetimeLocal,
	convertDatetimeAndShiftTimezoneForRedux,
	convertFromReduxToDatetimeLocalAndShiftTimezone,
	getDatetimeLocalToStringShiftDateToUtc,
	convertDatetimeForRedux,
	convertFromReduxToDatetime,
	getNameDayByDate,
	removeTimezoneShiftDateToTimezone,
	getUrlCountry,
	getStartDateAndEndDateBySelectFilter,
	getCountryByUrlCountry
};