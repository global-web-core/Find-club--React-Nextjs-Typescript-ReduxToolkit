import { Http } from '../../globals';
import {HttpInterface, CountriesInterface} from '../../typesAndInterfaces/interfaces'
import { controllers } from '../../globals/Constants/Constants';
import { countriesColumns } from '../../globals/Constants/СolumnsDb';

const getByRoute = async (route: string): Promise<HttpInterface.Get<CountriesInterface.Db>> => await Http.get(controllers.countries, {conditions:[{k:countriesColumns.route,v:route}]});
const getAll = async (): Promise<HttpInterface.Get<CountriesInterface.Db>> => await Http.get(controllers.countries, {});

export {
	getByRoute,
	getAll
}