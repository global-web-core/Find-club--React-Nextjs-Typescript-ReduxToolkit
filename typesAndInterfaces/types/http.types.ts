import {AccountsInterface, CategoriesByInterestsInterface, CategoryInterface, CitiesByCountriesInterface, CitiesInterface, CountriesInterface} from '../interfaces'

export type TypeObjectsFromDb = AccountsInterface.Db | CategoryInterface.Db | CategoriesByInterestsInterface.Db | CitiesInterface.Db | CitiesByCountriesInterface.Db | CountriesInterface.Db;