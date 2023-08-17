import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.citiesbycountries, {});
const getAllByCountry	= async (idCountry: number) => await Http.get(controllers.citiesbycountries, {conditions:[{k:'idCountry',v:idCountry}]});

export {
	getAll,
	getAllByCountry
}