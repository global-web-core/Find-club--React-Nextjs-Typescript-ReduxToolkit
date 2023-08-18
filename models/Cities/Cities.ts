import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { citiesColumns } from '../../globals/Constants/СolumnsDb';
import { CitiesInterface, HttpInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<CitiesInterface.Db>> => await Http.get(controllers.cities, {});
const getAllByRouteCity	= async (route: string): Promise<HttpInterface.Get<CitiesInterface.Db>> => await Http.get(controllers.cities, {conditions:[{k:citiesColumns.route,v:route}]});

export {
	getAll,
	getAllByRouteCity
}