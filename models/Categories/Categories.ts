import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll	= async ()		=> await Http.get(controllers.categories, {});
const getAllByRoute	= async (route: string)		=> await Http.get(controllers.categories, {conditions:[{k:'route',v:route}]});

export {
	getAll,
	getAllByRoute
}