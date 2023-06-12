import {LanguageTranslation} from '../../models';
import { Constants } from '../../globals';
import {CountriesInterface, LanguageTranslationInterface, LanguagesInterface} from '../../interfaces';
import { LS, ML } from '../../globals';

const textForPageCountry = ['selectCountry', 'selectLanguage', 'goTo', 'ru', 'us', 'russian', 'english'];

const checkNeedTranslationText = () => {
	const saveSetLanguage = getLanguage();
	if (!saveSetLanguage) {
		return false;
	}
	if (saveSetLanguage === Constants.settingDefault.LANGUAGE) {
		return false;
	}
	return true;
}

const getChangeTranslationText = async (text, page = null) => {
	const saveSetLanguage = getLanguage();
	if(!checkNeedTranslationText()) {
		return text;
	}
	const changeTextTranslation = await getTranslationText(page, saveSetLanguage);
	if (changeTextTranslation) return changeTextTranslation;
}

const getTranslationText = async (page = null, language = Constants.settingDefault.LANGUAGE) => {
	const textDb = await LanguageTranslation.get(language);
	
	const text: textObtect = {};
	if (textDb) {
		const listText = textDb.data;
		
		listText.forEach((fieldText: LanguageTranslationInterface.Translation) => {
			if (!page) {
				text[fieldText.nameText] = fieldText.translation
			} else if (page === 'countries') {
				text[fieldText.nameText] = fieldText.translation
			}
		});
		return text;
	}
	return null;
}

const getPathByCountry = (countries: CountriesInterface.Country[], languages: LanguagesInterface.Languages[], value: string) => {
	const country = countries.find(country => country.route === value);
	const language = country && languages.find(language => language.idCountry === country.id);
	if (country?.id === language?.idCountry && country) {
		return value;
	} else {
		return null;
	}
}

const addInPathLanguage = (statedLanguage: string, language: LanguagesInterface.Languages | undefined) => {
	if (!statedLanguage || statedLanguage === language?.route) {
		return '';
	} else {
		return '-' + statedLanguage;
	}
}

const setLanguageByPath = (pathLanguage: string, listLanguages: LanguagesInterface.Languages[], country: CountriesInterface.Country) => {
	const currentLanguage: LanguagesInterface.Languages | undefined = listLanguages.find(language => language.idCountry === country.id);
	const saveSetLanguage = getLanguage();
	pathLanguage = ((pathLanguage.length === 2 && currentLanguage?.route) || (pathLanguage.length === 5 && pathLanguage.slice(3, 5))) as string;
	if (!saveSetLanguage) ML.setLanguage(pathLanguage);
	if (saveSetLanguage !== pathLanguage && pathLanguage) ML.setLanguage(pathLanguage);
}

const setLanguageByBrowser = (listLanguages: LanguagesInterface.Languages[]) => {
	if (typeof window !== "undefined") {
		const userLanguage = window.navigator?.language?.slice(0,2) || null;
		const currentLanguage = listLanguages.find(language => language.route === userLanguage);
		const statedLanguage = getLanguage();
		if (currentLanguage && !statedLanguage) {
			setLanguage(currentLanguage.route);
		}
	}
}

const getLanguage = () => {
	return LS.get(LS.key.language);
}

const setLanguage = (language: string) => {
	LS.set(LS.key.language, language);
}

const key = {
	selectCountry: 'select-сountry',
	selectCity: 'select-city',
	selectInterest: 'select-interest',
	selectLanguage: 'select-language',
	selectCategory: 'select-category',
	goTo: 'go-to',
	ru: 'ru',
	us: 'us',
	moscow: 'moscow',
	saintPetersburg: 'saint-petersburg',
	newYork: 'new-york',
	losAngeles: 'los-angeles',
	it: 'it',
	fitness: 'fitness',
	category: 'category',
	interest: 'interest',
	city: 'city',
	country: 'country',
	allIt: 'all-it',
	programming: 'programming',
	smartFitness: 'smart-fitness',
	loading: 'loading',
	yourMeetings: 'your-meetings',
	all: 'all',
	iOrganise: 'i-organise',
	organizedByOthers: 'organized-by-others',
	organisesAnother: 'organises-another',
	alreadyGone: 'already-gone',
	wanted: 'wanted',
	confirmations: 'confirmations',
	meetingPoint: 'meeting-point',
	languagePeopleMeeting: 'the-language-of-the-people-at-the-meeting',
	goToChat: 'go-to-chat',
	cancelMeeting: 'cancel-meeting',
	resumeMeeting: 'resume-the-meeting',
	meetingNotSpecifiedDiscuss: 'meeting-place-not-specified-discuss-in-chat',
	iPlanToGo: 'i-plan-to-go',
	planningToGo: 'planning-to-go',
	iDefinitelyComing: 'i-am-definitely-coming',
	definitelyComing: 'definitely-coming',
	undecided: 'undecided',
	iUndecided: 'i-am-undecided',
	offerToMeet: 'offer-to-meet',
	iNotGoing: 'i-am-not-going',
	continue: 'continue',
	writeMeetingPlace: 'write-a-meeting-place',
	error: 'error',
	successfully: 'successfully',
	warning: 'warning',
	receivingMeeting: 'when-receiving-the-meeting-list',
	addedMeeting: 'added-meeting',
	onAddingMeeting: 'on-adding-a-meeting',
	meetingCancelled: 'meeting-cancelled',
	meetingWill: 'meeting-will',
	meetingExists: 'this-meeting-already-exists',
}

export {
	addInPathLanguage,
	checkNeedTranslationText,
	getTranslationText,
	getChangeTranslationText,
	getPathByCountry,
	getLanguage,
	setLanguageByPath,
	setLanguageByBrowser,
	setLanguage,
	key
}

interface textObtect {
  [index: string]: string;
}