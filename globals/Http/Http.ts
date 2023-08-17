import {Constants} from '../../globals/';
import {TypeController, TypeMethodHttp} from '../../types'

const isDevelopmentMode = process.env.NODE_ENV !== 'production';

const request = async (controller: TypeController, method: TypeMethodHttp, data: any) => {
	const url = `${Constants.API.url}/${controller}/${method}`;
	
	const options = {
		method:'POST',
		mode:'cors',
		headers:{
			'Authentication':Constants.API.key,
			'Content-Type':'application/json'
		},
		body: data == null ? null : JSON.stringify(data)
	};
	const response = await fetch(url, options as any).catch((error) => console.log('Error fetch with server!!!', error));
	if (!response) {
		console.log('Error connection with server!!!');
		// return;
	}
	if (response.status === 200) {
		// if (isDevelopmentMode) console.log(response); // Uncomment to see the request in the console
		const json = response.json();
		// if (isDevelopmentMode) console.log(json); // Uncomment to see the request in the console
		return json;
	}
	console.log('Error fetch!!! Status 200 was not received:', response.json());
	// throw await response.json();
	return {code: 404, data:undefined};
};

const get = async (controller: TypeController, data: any) => await request(controller, Constants.methodHttp.get, data);
const getCount = async (controller: TypeController, data: any) => await request(controller, Constants.methodHttp.getCount, data);
const add = async (controller: TypeController, data: any) => await request(controller, Constants.methodHttp.add, data);
const update = async (controller: TypeController, data: any) => await request(controller, Constants.methodHttp.update, data);
const remove = async (controller: TypeController, data: any) => await request(controller, Constants.methodHttp.delete, data);



export {
	get,
	getCount,
	add,
	update,
	remove,
	request
};