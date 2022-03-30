import {User, UserDoc} from '@/biz/user';
import {sessionTimings} from '@obj/user';
import {randomCode} from '@/lib/utils';
import {Request, Response, NextFunction} from 'express';
import {AuthData, authHeader} from '@obj/auth';

interface apiKeyEntry {
	user: any;
	lastAccess: number;
}
const apiKeys: {[key: string]: apiKeyEntry} = {};

setInterval(()=> {
	let now = Date.now();
	for(let apiKey in apiKeys)
		if(now - apiKeys[apiKey].lastAccess > sessionTimings.lifespan)
			delete apiKeys[apiKey];
}, sessionTimings.interval)

declare global {
	namespace Express {
		export interface Request {
			credentials: UserDoc;
			apiKey: string;
		}
	}
}

export async function logIn(userDesc: string|UserDoc, pass?: string): Promise<AuthData> {
	const user = 'string'=== typeof userDesc ?
		await User.findOne({email: <string>userDesc, pass}) :
		<UserDoc>userDesc;
	if(!user)
		return null;
	let key: string;
	do { key = randomCode(/*256*/); } while(apiKeys[key]);	//over-killed security
	apiKeys[key] = { user: user._id, lastAccess: Date.now() };
	return {authToken: key, _id: user._id, name: user.name, role: user.role};
}

export function logOut(apiKey: string) {
	delete apiKeys[apiKey];
}

export async function apiKeyAuthentication(req: Request, res: Response, next: NextFunction) {
	const apiKey = <string>req.headers[authHeader.toLowerCase()];
	if(apiKey) {
		if(apiKeys[apiKey]) {
			apiKeys[apiKey].lastAccess = Date.now();
			req.credentials = await User.findOne({_id: apiKeys[apiKey].user});
			req.apiKey = apiKey;
			next();
		} else {
			res.status(401).send('Logged out');
		}
	} else next();
}