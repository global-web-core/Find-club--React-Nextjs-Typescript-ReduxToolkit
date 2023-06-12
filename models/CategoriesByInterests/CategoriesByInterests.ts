import { Http } from '../../globals';

const getAll	= async ()		=> await Http.get('categoriesbyinterests', {});
const getAllByIdInterest	= async (id: number)		=> await Http.get('categoriesbyinterests', {conditions:[{k:'idInterest',v:id}]});

export {
	getAll,
	getAllByIdInterest
}