import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('citiesbycountries', {});
const getAllByCountry	= async (idCountry: number)		=> await Http.get('citiesbycountries', {conditions:[{k:'idCountry',v:idCountry}]});

export {
	getAll,
	getAllByCountry
}