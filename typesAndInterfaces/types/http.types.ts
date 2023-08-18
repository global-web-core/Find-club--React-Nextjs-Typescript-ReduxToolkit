import {AccountsInterface, CategoriesByInterestsInterface, CategoryInterface, CitiesByCountriesInterface, CitiesInterface, CountriesInterface, DesiresInterface, InterestsInterface, InterestsByCitiesInterface, LanguagesInterface, LanguageTranslationInterface} from '../interfaces'

export type TypeObjectsFromDb = AccountsInterface.Db | CategoryInterface.Db | CategoriesByInterestsInterface.Db | CitiesInterface.Db | CitiesByCountriesInterface.Db | CountriesInterface.Db | DesiresInterface.Db | InterestsInterface.Db | InterestsByCitiesInterface.Db | LanguagesInterface.Db | LanguageTranslationInterface.Db;