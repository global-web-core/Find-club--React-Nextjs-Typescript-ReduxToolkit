const prefix = '_FSLS';

const enum Key {
	language = "language"
}
interface TypesLs {
  [Key.language]: string;
}

const get = <Key extends keyof TypesLs>(key: Key) => {
	if(typeof window !== 'undefined') {
		const dataFromLs = localStorage.getItem(key + prefix)
		if (dataFromLs) {
			const data = JSON.parse(dataFromLs) as TypesLs[Key]
			return data;
		}
	}
	return null;
}

const set = <K extends Key>(key: Key, value: TypesLs[K]) => {
	if (typeof window !== 'undefined') {
		const data = JSON.stringify(value);
		return localStorage.setItem(key + prefix, data)
	}
};

const remove = (key: Key) => localStorage.removeItem(key + prefix);

const clear = () => localStorage.clear();

export {
	get,
	set,
	remove,
	clear,
	Key
}