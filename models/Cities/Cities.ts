import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll	= async ()		=> await Http.get(controllers.cities, {});
const getAllByRouteCity	= async (route: string)		=> await Http.get(controllers.cities, {conditions:[{k:'route',v:route}]});

export {
	getAll,
	getAllByRouteCity
}