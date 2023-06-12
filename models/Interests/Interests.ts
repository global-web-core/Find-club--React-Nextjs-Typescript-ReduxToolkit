import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('interests', {});
const getAllByRouteInterest	= async (route: string)		=> await Http.get('interests', {conditions:[{k:'route',v:route}]});

export {
	getAll,
	getAllByRouteInterest
}