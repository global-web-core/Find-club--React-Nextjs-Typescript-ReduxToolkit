import {InterestsInterface, CitiesInterface, LanguageTranslationInterface, LanguagesInterface, CountriesInterface, MetadataInterface, CategoryInterface} from '../interfaces';

export interface Props {
	listCities: CitiesInterface.Db[];
	listLanguages: LanguagesInterface.Db[];
	textTranslation: LanguageTranslationInterface.Txt;
	country: CountriesInterface.Db;
	metadata: MetadataInterface.Main;
	listCountries: CountriesInterface.Db[];
	listInterests: InterestsInterface.Db[];
	listCategories: CategoryInterface.Db[];
	language: LanguagesInterface.Db;
}