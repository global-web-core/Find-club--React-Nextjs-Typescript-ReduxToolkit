import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('categories', {});
const getAllByRoute	= async (route: string)		=> await Http.get('categories', {conditions:[{k:'route',v:route}]});

export {
	getAll,
	getAllByRoute
}