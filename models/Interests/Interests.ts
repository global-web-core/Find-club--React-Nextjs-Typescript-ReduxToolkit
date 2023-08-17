import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.interests, {});
const getAllByRouteInterest	= async (route: string) => await Http.get(controllers.interests, {conditions:[{k:'route',v:route}]});

export {
	getAll,
	getAllByRouteInterest
}