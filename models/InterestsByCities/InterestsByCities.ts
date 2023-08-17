import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.interestsbycities, {});
const getAllByCity = async (idCity: number) => await Http.get(controllers.interestsbycities, {conditions:[{k:'idCity',v:idCity}]});

export {
	getAll,
	getAllByCity
}