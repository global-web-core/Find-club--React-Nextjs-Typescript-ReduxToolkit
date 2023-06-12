import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('cities', {});
const getAllByRouteCity	= async (route: string)		=> await Http.get('cities', {conditions:[{k:'route',v:route}]});

export {
	getAll,
	getAllByRouteCity
}