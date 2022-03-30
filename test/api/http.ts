import {request} from 'chai';
import {authHeader} from '@obj/auth'
import {app} from '../../src/server';
import {projectHeader} from '@obj/project';

export interface Response {
	status: number;
	text: string;
	body?: any;
	projectStatus?: any;
}

async function response(rq: any, data?: object, auth?: string): Promise<Response> {
	if(auth) rq = rq.set(authHeader, auth);
	if(data) rq = rq.send(data);
	let res = await rq;
	let rv: Response = {
		status: res.status,
		text: res.text,
		body: res.body
	};
	if(res.headers[projectHeader.toLowerCase()])
		rv.projectStatus = JSON.parse(res.headers[projectHeader.toLowerCase()]);
	return rv;
}

export function get(url: string) {
	return request(app).get(url);
}

export function put(url: string, data?: object, auth?: string) {
	return response(request(app).put(url), data, auth);
}

export function post(url: string, data?: object, auth?: string) {
	return response(request(app).post(url), data, auth);
}

export function patch(url: string, data?: object, auth?: string) {
	return response(request(app).patch(url), data, auth);
}

export function del(url: string, auth?: string) {
	return response(request(app).del(url), undefined, auth);
}

export interface Auth {
	cust: string;
	spec: string;
	adm: string;
}

export async function logIns() {
	return {
		cust: (await post('/@/user/', {email: 'cust@s.pec', pass: 'pw-cust'})).body.authToken,
		spec: (await post('/@/user/', {email: 'spec@s.pec', pass: 'pw-spec'})).body.authToken,
		adm: (await post('/@/user/', {email: 'adm@s.pec', pass: 'pw-adm'})).body.authToken
	};
};

export async function logOuts(auth: Auth) {
	await post('/@/user/', undefined, auth.cust);
	await post('/@/user/', undefined, auth.spec);
	await post('/@/user/', undefined, auth.adm);
};