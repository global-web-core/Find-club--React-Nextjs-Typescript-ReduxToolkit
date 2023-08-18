import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { citiesByCountriesColumns } from '../../globals/Constants/СolumnsDb';
import { CitiesByCountriesInterface, HttpInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<CitiesByCountriesInterface.Db>> => await Http.get(controllers.citiesbycountries, {});
const getAllByCountry	= async (idCountry: number): Promise<HttpInterface.Get<CitiesByCountriesInterface.Db>> => await Http.get(controllers.citiesbycountries, {conditions:[{k:citiesByCountriesColumns.idCountry,v:idCountry}]});

export {
	getAll,
	getAllByCountry
}