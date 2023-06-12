const prefix = '_FSLS';

const get = (key: string) => {if(typeof window !== 'undefined') return JSON.parse(localStorage.getItem(key + prefix) as any || null);}
const set = (key: string, value: any) => {if (typeof window !== 'undefined') return localStorage.setItem(key + prefix, JSON.stringify(value))};
const remove = (key: string) => localStorage.removeItem(key + prefix);
const clear = () => localStorage.clear();

const key = {
	language: "language"
}

export {
	get,
	set,
	remove,
	clear,
	key
}