import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('interestsbycities', {});
const getAllByCity = async (idCity: number) => await Http.get('interestsbycities', {conditions:[{k:'idCity',v:idCity}]});

export {
	getAll,
	getAllByCity
}