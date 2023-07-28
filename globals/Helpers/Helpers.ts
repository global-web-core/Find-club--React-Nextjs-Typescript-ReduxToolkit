import { Constants } from "..";

const convertDatetimeForDb = (date) => {
	return date.toISOString().replace('T', ' ').replace('Z', '');
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
		return date.setHours(0, 0, 0, 0);
	}
};

const getEndDayByDate = (date) => {
	if (date) {
		return date.setHours(23, 59, 59, 999);
	}
};

const getEndMonthByDate = (date) => {
	if (date) {
		return new Date(date.getFullYear(), date.getMonth()+1, 0).setHours(23, 59, 59, 999);
	}
};

const getNameMonthByDate = (date, language) => {
	if (date, language) {
		const nameMonthByDate = date.toLocaleString(language, { month: 'long' });
		if (nameMonthByDate) return nameMonthByDate;
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
	getNameMonthByDate
};