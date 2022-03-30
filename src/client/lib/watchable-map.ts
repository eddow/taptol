var objKeys: {[key: string]: any} = {};

function objKey(key: any): object {
	return 'object'=== typeof key ? key :
		(objKeys[key.toString()] || (objKeys[key.toString()] = {}));
}

export class WatchableMap<K extends object = any, V = any> implements WeakMap<K, V> {
	map: WeakMap<object, V> = new WeakMap<object, V>();
	watchers: WeakMap<object, MapWatch<V>> = new WeakMap<object, MapWatch<V>>();
	raise(key: K, value?: V) {
		let okey = objKey(key);
		if(this.watchers.has(okey))
			this.watchers.get(okey).value = value;
		return this;
	}
	watcher(key: K) {
		let okey = objKey(key);
		if(this.watchers.has(okey))
			return this.watchers.get(okey);
		let rv = new MapWatch<V>(this.map.get(okey));
		this.watchers.set(okey, rv);
		return rv;
	}

	constructor(...args: any[]) {
		this.map = new WeakMap<object, V>(...args);
	}
	get(key: K): V {
		return this.map.get(objKey(key));
	}
	has(key: K): boolean {
		return this.map.has(objKey(key));
	}
	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.map[Symbol.iterator]();
	}
	[Symbol.toStringTag]: string;
	set(key: K, value: V) {
		this.map.set(objKey(key), value);
		return this.raise(key, value);
	}
	delete(key: K) {
		this.raise(key);
		return this.map.delete(objKey(key));
	}
}

export class MapWatch<V = any> {
	value: V;
	constructor(value: V) { this.value = value; }
}