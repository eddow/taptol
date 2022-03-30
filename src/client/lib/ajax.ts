function ajax<T>(method: string, url: string, data: Dictionary): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		let request = {
			method,
			data,
			headers: {}
		};
		globals.prepare.map(cb=> cb(request));
		$.ajax(url?'/@/'+url:'/@', request).done((response: T, status: string, xhr: any)=> {
			for(let cb of globals.success) cb(response, xhr);
			resolve(response);
		}).fail((err: any)=> {
			for(let cb of globals.failure) cb(err);
			reject(err);
		});
	});
}
/**
 * Allow other part of the code to hook requests (display errors, manage headers, ...)
 */
export const globals = {
	success: <((...args: any[])=> void)[]>[],
	failure: <((err: any)=> void|boolean)[]>[],	//Failure function return true if the error should be ignored
	prepare: <((request: any)=> void)[]>[]
}

export function post<T>(url: string, data?: Dictionary): Promise<T> {
	return ajax('POST', url, data);
}

export function put<T>(url: string, data?: Dictionary): Promise<T> {
	return ajax('PUT', url, data);
}

export function patch<T>(url: string, data?: Dictionary): Promise<T> {
	return ajax('PATCH', url, data);
}

export function del<T>(url: string, data?: Dictionary): Promise<T> {
	return ajax('DELETE', url, data);
}

export function get<T>(url?: string, data?: Dictionary): Promise<T> {
	return ajax('GET', url, data);
}