import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { CategoriesByInterestsInterface, HttpInterface } from '../../typesAndInterfaces/interfaces';
import { categoriesByInterestsColumns } from '../../globals/Constants/СolumnsDb';

const getAll = async (): Promise<HttpInterface.Get<CategoriesByInterestsInterface.Db>> => await Http.get(controllers.categoriesbyinterests, {});
const getAllByIdInterest = async (id: number): Promise<HttpInterface.Get<CategoriesByInterestsInterface.Db>> => await Http.get(controllers.categoriesbyinterests, {conditions:[{k:categoriesByInterestsColumns.idInterest,v:id}]});

export {
	getAll,
	getAllByIdInterest
}