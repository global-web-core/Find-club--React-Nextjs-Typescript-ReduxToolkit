import { Http } from '../../globals';
import { controllers } from '../../globals/Constants/Constants';
import { interestsbycitiesColumns } from '../../globals/Constants/СolumnsDb';
import { HttpInterface, InterestsByCitiesInterface } from '../../typesAndInterfaces/interfaces';

const getAll = async (): Promise<HttpInterface.Get<InterestsByCitiesInterface.Db>> => await Http.get(controllers.interestsbycities, {});
const getAllByCity = async (idCity: number): Promise<HttpInterface.Get<InterestsByCitiesInterface.Db>> => await Http.get(controllers.interestsbycities, {conditions:[{k:interestsbycitiesColumns.idCity,v:idCity}]});

export {
	getAll,
	getAllByCity
}