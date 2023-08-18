import {LanguageTranslation} from '../../models';
import {CountriesInterface, LanguageTranslationInterface, LanguagesInterface } from '../../interfaces';
import { LS, ML, Constants } from '../../globals';
import keyText from './KeyText';

const checkNeedTranslationText = () => {
	const saveSetLanguage = getLanguage();
	if (!saveSetLanguage) {
		return false;
	}
	return true;
}

const getChangeTranslationText = async (text:LanguageTranslationInterface.TextTranslation | null) => {
	const saveSetLanguage = getLanguage();
	if(!checkNeedTranslationText() && text) {
		return text;
	}
	const changeTextTranslation = await getTranslationText(saveSetLanguage);
	if (changeTextTranslation) return changeTextTranslation;
}

const getTranslationText = async (language = Constants.settingDefault.LANGUAGE) => {
	const textDb = await LanguageTranslation.get(language);
	
	const text: LanguageTranslationInterface.TextTranslation = {};
	if (textDb.data) {
		const listText = textDb.data;
		
		listText.forEach((fieldText: LanguageTranslationInterface.Translation) => {
			text[fieldText.nameText] = fieldText.translation
		});
		return text;
	}
	return null;
}

const getPathByCountry = (countries: CountriesInterface.Db[], languages: LanguagesInterface.Languages[], value: string) => {
	const country = countries.find(country => country.route === value);
	const language = country && languages.find(language => language.idCountry === country.id);
	if (country?.id === language?.idCountry && country) {
		return value;
	} else {
		return null;
	}
}

const addInPathLanguage = (statedLanguage: string, language: LanguagesInterface.Languages | undefined, urlCountry: string) => {
	if (!statedLanguage || statedLanguage === language?.route) {
		return '';
	} else {
		if (urlCountry === statedLanguage) return '';
		return '-' + statedLanguage;
	}
}

const setLanguageByPath = (pathLanguage: string, listLanguages: LanguagesInterface.Languages[], country: CountriesInterface.Db) => {
	const languageByPath = getLanguageByPath(pathLanguage, listLanguages, country);
	const saveSetLanguage = getLanguage();
	if (!saveSetLanguage) ML.setLanguage(languageByPath);
	if (saveSetLanguage !== languageByPath && languageByPath) ML.setLanguage(languageByPath);
}

const getLanguageByPath = (pathLanguage: string, listLanguages: LanguagesInterface.Languages[], country: CountriesInterface.Db) => {
	const currentLanguage: LanguagesInterface.Languages | undefined = listLanguages.find(language => language.idCountry === country.id);
	pathLanguage = ((pathLanguage.length === 2 && currentLanguage?.route) || (pathLanguage.length === 5 && pathLanguage.slice(3, 5))) as string;

	return pathLanguage;
}

const setLanguageByBrowser = (listLanguages: LanguagesInterface.Languages[]) => {
	if (typeof window !== "undefined" && listLanguages) {
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

const key = keyText;

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
	key,
	getLanguageByPath,
}