import { Constants } from "..";
import {ML} from '../../globals';
import { LanguagesInterface } from "../../typesAndInterfaces/interfaces";
import { TypeLanguages } from "../../typesAndInterfaces/types";

const copyOfDateInStringTimezoneUTC = (date: Date | undefined): string | undefined => {
	if (typeof date === 'object') return JSON.parse(JSON.stringify(date))
}

const convertDatetimeForRedux = (date: Date) => {
	if (typeof date === 'object') return copyOfDateInStringTimezoneUTC(date);
}

const convertFromReduxToDatetime = (date: string | Date) => {
	if (typeof date === 'string') {
		const dateTimeLocal = new Date(date);
		if (typeof dateTimeLocal === 'object') {
			return dateTimeLocal;
		}
	}
}

const convertDatetimeForDb = (date) => {
	return date.toISOString().replace('T', ' ').replace('Z', '');
}

const removeFromDatetimeTAndZ = (date) => {
	return date.replace('T', ' ').replace('Z', '');
}

const convertDatetimeLocalForDb = (date) => {
	return new Date(date).toISOString().replace('T', ' ').replace('Z', '');
}

const currentDatetimeForDb = () => {
	return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

const currentDatetimeDbToDatetimeLocal = (date) => {
	const dateTimeUtsTZ = date.replace(/\s/g,'T') + 'Z';
	return new Date(dateTimeUtsTZ);
}

const currentDatetimeDbToDatetimeLocalString = (date) => {
	const changeDate = currentDatetimeDbToDatetimeLocal(date);
	return changeDate.toLocaleString();
}

const convertDatetimeLocalForRedux = (date: Date | null) => {
	if (!date) return date
	const datetimeForRedux = convertDatetimeForRedux(date);
	if (typeof datetimeForRedux === 'string') {
		return datetimeForRedux;
	}
}

const removeTimezoneShiftDateToTimezone = (date) => {
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

const getDatetimeLocalToStringShiftDateToUtc = (date) => {
	if (typeof date === 'string') {
		const datetimeLocal = removeFromDatetimeTAndZ(date);
		if (typeof datetimeLocal === 'string') return datetimeLocal;
	}
}

const convertDatetimeAndShiftTimezoneForRedux = (date: Date): string | null | undefined => {
	if (!date) return date
	const dateTimeNewCopy = copyOfDateInStringTimezoneUTC(date);
	const dateShiftTimezone = removeTimezoneShiftDateToTimezone(new Date (dateTimeNewCopy));
	const datetimeForRedux = convertDatetimeForRedux(dateShiftTimezone);
	if (typeof datetimeForRedux === 'string') {
		return datetimeForRedux;
	}
}

const convertFromReduxToDatetimeLocal = (date): Date | undefined => {
	if (!date) return date;
	return convertFromReduxToDatetime(date);
}

const convertFromReduxToDatetimeLocalAndShiftTimezone = (date) => {
	if (!date) return date
	const dateShiftTimezone = getDatetimeLocalToStringShiftDateToUtc(date);

	return convertFromReduxToDatetime(dateShiftTimezone);
}

const filterPastDate = (list, nameFilterColumn) => {
	if (list.length > 0) {
		const filteresList = list.filter(item => {
			const currentDateTime = new Date();
			const dateTimeFromList = currentDatetimeDbToDatetimeLocal(item[nameFilterColumn]);
			return currentDateTime >= dateTimeFromList;
		});
		return filteresList;
	}
}

const randomGenerateLetterAndNumber = (length) => {
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

const getStartDayByDate = (date) => {
	if (date) {
		return new Date(date.setHours(0, 0, 0, 0));
	}
};

const getEndDayByDate = (date) => {
	if (date) {
		return new Date(date.setHours(23, 59, 59, 999));
	}
};

const getEndMonthByDate = (date) => {
	if (date) {
		return new Date(date.getFullYear(), date.getMonth()+1, 0, 23, 59, 59, 999);
	}
};

const getNameMonthByDate = (date: Date | string, language: TypeLanguages): string | undefined => {
	if (typeof date === 'string' && language) {
		const nameMonthByDate = new Date(date).toLocaleString(language, { month: 'long' });
		if (nameMonthByDate) return nameMonthByDate;
	}
	if (typeof date === 'object' && language) {
		const nameMonthByDate = date.toLocaleString(language, { month: 'long' });
		if (nameMonthByDate) return nameMonthByDate;
	}
}

const getNameDayByDate = (date) => {
	if (typeof date === 'string') {
		const dateTimeLocal = new Date(date);
		if (typeof dateTimeLocal === 'object') {
			return dateTimeLocal.toLocaleDateString();
		}
	}
}

const getUrlCountry = (pathCountry, countries, languages) => {
	let urlCountry = pathCountry;
	if (urlCountry) {
		const settingLanguage = ML.getLanguage();
		const currentCountry = countries.find(country => country.route === urlCountry);
		const currentLanguage = languages.find((language: LanguagesInterface.Db) => currentCountry && language.idCountry === currentCountry.id);
		if (!settingLanguage && currentLanguage) ML.setLanguage(currentLanguage.route);

		urlCountry = urlCountry + ML.addInPathLanguage(settingLanguage, currentLanguage, urlCountry);

		return urlCountry;
	}
}

const getStartDateAndEndDateBySelectFilter = (selectFilter, calendarMeetings, activeStartDateChange, selectedDay) => {
	// if (!selectFilter || !calendarMeetings || !activeStartDateChange || !selectedDay) return;
	if (selectFilter.basic === Constants.nameBasicFilter.month) {
		const startDate = calendarMeetings.activePeriod.start;
		const endDate = calendarMeetings.activePeriod.end;

		return {startDate, endDate};
	}

	if (selectFilter.basic === Constants.nameBasicFilter.day) {
		const newDate = new Date();
		let currentDate;
		if (activeStartDateChange && !selectedDay) {
			const activeStartDate = convertFromReduxToDatetimeLocalAndShiftTimezone(activeStartDateChange?.activeStartDate);
			if (activeStartDate > newDate) {
				currentDate = activeStartDate;
			} else {
				currentDate = newDate;
			}
		} else if (selectedDay) {
			currentDate = selectedDay;
		} else {
			currentDate = newDate;
		}
		const startDay = convertDatetimeLocalForDb(getStartDayByDate(currentDate));
		const endDay = getEndDayByDate(currentDate);
		const lastDate = convertDatetimeLocalForDb(endDay);
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