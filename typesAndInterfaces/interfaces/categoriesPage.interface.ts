import {InterestsInterface, CitiesInterface, LanguageTranslationInterface, LanguagesInterface, CountriesInterface, MetadataInterface, CategoryInterface} from '../interfaces';

export interface Props {
	listCountries: CountriesInterface.Db[];
	listCities: CitiesInterface.Db[];
	listInterests: InterestsInterface.Db[];
	listCategories: CategoryInterface.Db[];
	listLanguages: LanguagesInterface.Db[];
	textTranslation: LanguageTranslationInterface.Txt;
	country: CountriesInterface.Db;
	category: CategoryInterface.Db;
	city: CitiesInterface.Db;
	interest: InterestsInterface.Db;
	metadata: MetadataInterface.Main;
	language: LanguagesInterface.Db;
}