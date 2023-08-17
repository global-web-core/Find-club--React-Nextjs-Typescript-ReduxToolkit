import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';

const getAll = async () => await Http.get(controllers.categoriesbyinterests, {});
const getAllByIdInterest = async (id: number) => await Http.get(controllers.categoriesbyinterests, {conditions:[{k:'idInterest',v:id}]});

export {
	getAll,
	getAllByIdInterest
}