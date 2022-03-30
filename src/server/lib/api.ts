import {Request, Response, NextFunction} from 'express';

export function sanitizer(...fields: string[]) {
	return function(src: any): {[key: string]: any} {
		if(!src) return;
		let rv = {};
		for(let field of fields) rv[field] = src[field];
		return rv;
	}
}

/**
 * Wraps an API with try/catch and send 500 on failure
 * @param api API to wrap
 * @returns 
 */
export function API<T>(
	api: (req: Request, res: Response, next: NextFunction)=> Promise<T>
) {
	return async function(req: Request, res: Response, next: NextFunction) {
		try {
			await api(req, res, next);
		} catch(err) {
			// FRP: log the error message in an error log and return a standard "internal error" message
			res.status(500).send(err.message);
		}
	}
}

/**
 * Wraps an API to check the credentials and answer a default 403 on failure
 * @param role string[] list of allowed roles ([] for "all roles")
 * @param api API to wrap
 * @returns 
 */
export function auth<T>(
	role: string|string[],
	api: (req: Request, res: Response, next: NextFunction)=> Promise<T>
) {
	let roles = 'string'=== typeof role ? [role] : <string[]>role;
	return API(function(req: Request, res: Response, next: NextFunction) {
		if(req.credentials && (!roles.length || roles.includes(req.credentials.role)))
			return api(req, res, next);
		else
			res.status(403).send('Unauthorized');
	});
}