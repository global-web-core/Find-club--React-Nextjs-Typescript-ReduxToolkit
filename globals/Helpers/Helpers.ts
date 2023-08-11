import { Constants } from "..";
import {ML} from '../../globals';
import { LanguagesInterface } from "../../interfaces";

const copyOfDateInStringTimezoneUTC = (date) => {
	if (typeof date === 'object') return JSON.parse(JSON.stringify(date))
}

const convertDatetimeForRedux = (date) => {
	if (typeof date === 'object') return copyOfDateInStringTimezoneUTC(date);
}

const convertFromReduxToDatetime = (date) => {
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

const convertDatetimeLocalForRedux = (date) => {
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

const convertDatetimeAndShiftTimezoneForRedux = (date) => {
	if (!date) return date
	const dateTimeNewCopy = copyOfDateInStringTimezoneUTC(date);
	const dateShiftTimezone = removeTimezoneShiftDateToTimezone(new Date (dateTimeNewCopy));
	const datetimeForRedux = convertDatetimeForRedux(dateShiftTimezone);
	if (typeof datetimeForRedux === 'string') {
		return datetimeForRedux;
	}
}

const convertFromReduxToDatetimeLocal = (date) => {
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

const calculateCountPageByCountRows = (countRows) => {
	if (countRows && countRows > 0) {
		const countPage = Math.ceil(countRows / Constants.pagination.limit);
		return countPage;
	}
}

const increaseDateByMonths = (date, countMonths) => {
	if (date, countMonths) {
		let incrementedDate;
		const incrementedMonths = new Date(date.setMonth(date.getMonth()+countMonths));
		incrementedDate = new Date(incrementedMonths.setHours(23, 59, 59, 999));
		return incrementedDate;
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

const getNameMonthByDate = (date, language) => {
	if (typeof date === 'string', language) {
		const nameMonthByDate = new Date(date).toLocaleString(language, { month: 'long' });
		if (nameMonthByDate) return nameMonthByDate;
	}
	if (typeof date === 'object', language) {
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
		const currentLanguage = languages.find((language: LanguagesInterface.Languages) => currentCountry && language.idCountry === currentCountry.id);
		if (!settingLanguage && currentLanguage) ML.setLanguage(currentLanguage.route);

		urlCountry = urlCountry + ML.addInPathLanguage(settingLanguage, currentLanguage, urlCountry);

		return urlCountry;
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
	getUrlCountry
};