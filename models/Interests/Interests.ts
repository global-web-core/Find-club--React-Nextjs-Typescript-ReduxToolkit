import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { interestsColumns } from '../../globals/Constants/СolumnsDb';
import { HttpInterface, InterestsInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<InterestsInterface.Db>> => await Http.get(controllers.interests, {});
const getAllByRouteInterest	= async (route: string): Promise<HttpInterface.Get<InterestsInterface.Db>> => await Http.get(controllers.interests, {conditions:[{k:interestsColumns.route,v:route}]});

export {
	getAll,
	getAllByRouteInterest
}