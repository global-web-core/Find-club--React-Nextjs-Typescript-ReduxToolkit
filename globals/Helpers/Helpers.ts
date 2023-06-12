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

export {
	convertDatetimeForDb,
	convertDatetimeLocalForDb,
	currentDatetimeForDb,
	randomGenerateLetterAndNumber,
	currentDatetimeDbToDatetimeLocal,
	currentDatetimeDbToDatetimeLocalString,
	filterPastDate
};