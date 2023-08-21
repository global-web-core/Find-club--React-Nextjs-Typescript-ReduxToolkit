import {CountriesInterface, LanguageTranslationInterface, LanguagesInterface, MetadataInterface} from '../interfaces';

export interface Props {
	listCountries: CountriesInterface.Db[];
	listLanguages: LanguagesInterface.Db[];
	text: LanguageTranslationInterface.Txt;
	metadata: MetadataInterface.Main;
}