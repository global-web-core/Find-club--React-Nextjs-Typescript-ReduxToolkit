import {Constants} from '../../globals/';

const isDevelopmentMode = process.env.NODE_ENV !== 'production';

const request = async (controller: string, method: string, data: any) => {
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
		return;
	}
	if (response.status === 200) {
		// if (isDevelopmentMode) console.log(response); // Uncomment to see the request in the console
		const json = response.json();
		// if (isDevelopmentMode) console.log(json); // Uncomment to see the request in the console
		return json;
	}
	console.log('Error fetch!!! Status 200 was not received:', response.json());
	// throw await response.json();
	return;
};

const get		= async (controller: string, data: any) => await request(controller, 'get', data);
const post		= async (controller: string, data: any) => await request(controller, 'add', data);
const put		= async (controller: string, data: any) => await request(controller, 'update', data);
const remove	= async (controller: string, data: any) => await request(controller, 'delete', data);



export {
	get,
	post,
	put,
	remove,
	request
};