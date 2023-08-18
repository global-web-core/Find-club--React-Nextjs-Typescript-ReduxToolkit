import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { categoriesColumns } from '../../globals/Constants/СolumnsDb';
import { CategoryInterface, HttpInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<CategoryInterface.Db>> => await Http.get(controllers.categories, {});
const getAllByRoute	= async (route: string): Promise<HttpInterface.Get<CategoryInterface.Db>> => await Http.get(controllers.categories, {conditions:[{k:categoriesColumns.route,v:route}]});

export {
	getAll,
	getAllByRoute
}