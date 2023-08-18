import { Http } from '../../globals';
import {HttpInterface, CountriesInterface} from '../../interfaces'
import { controllers } from '../../globals/Constants/Constants';

const getByRoute = async (route: string): Promise<HttpInterface.Get<CountriesInterface.Country>> => await Http.get(controllers.countries, {conditions:[{k:'route',v:route}]});
const getAll = async (): Promise<HttpInterface.Get<CountriesInterface.Country>> => await Http.get(controllers.countries, {});

export {
	getByRoute,
	getAll
}