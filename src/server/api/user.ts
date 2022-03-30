import express from 'express';
import {Request, Response} from 'express';
import {md5, randomCode} from '@/lib/utils';
import {User, UserDoc} from '@/biz/user';
import {logIn, logOut} from '@/lib/auth';
import {API, auth} from '@/lib/api';
import sendCode from '@/lib/email';

var api = express();
export default api;

const codeExpiration = 24*60*60*1000;	// 1 day

api.get('/', API(async (req: Request, res: Response)=> {
	res.send(req.credentials ? {
			_id: req.credentials._id,
			role: req.credentials.role,
			name: req.credentials.name
		} : {role: 'anon', name: ''});
}));
/**
 * lookup
 */
api.get('/:role', auth(['adm'], async (req: Request, res: Response)=> {
	if(!['cust', 'spec'].includes(req.params.role))
		return res.status(400).send('Bad role');
	let users = await User.find({role: <any>req.params.role}).lean(),
		rv = {};
	for(let user of users) rv[user._id] = user.name;
	res.send(rv);
}));
api.post('/', API(async (req: Request, res: Response)=> {	//login/logout
	if(req.fields.email) { //login
		if(req.credentials)
			res.status(400).send('Already logged in');
		else {
			const passMd5 = md5(<string>req.fields.pass);
			const login = await logIn(<string>req.fields.email, passMd5);
			if(login) {
				res.send(login);
			} else
				res.status(403).send('Bad login');
		}
	} else {	//logout
		if(!req.credentials)
			res.status(400).send('Already logged out');
		else {
			logOut(req.apiKey);
			res.send('Successfully logged out');
		}
	}
}));
api.put('/pwc', API(async (req: Request, res: Response)=> {	//set password w/ verification code
	let user = await User.findOne({code: <string>req.fields.code});
	if(req.fields.pass.length < 6)
		return res.status(400).send('The password must contain at least 6 characters');
	if(user) {
		let expired = Date.now() > user.expiration;
		user.code = undefined;
		user.expiration = undefined;
		if(!expired)
			user.pass = md5(<string>req.fields.pass);
		await user.save();
		if(!expired)
			return res.send(await logIn(user));
	}	// Remaining done also if `expired`
	res.status(404).send('Inexistant code');
}));
api.post('/pwc', API(async (req: Request, res: Response)=> {	//reset password
	let user = await User.findOne({email: <string>req.fields.email});
	if(!user)
		res.status(400).send('E-mail already registered');
	else {
		let code = randomCode(/*256*/);
		user.code = code;
		user.expiration = Date.now()+codeExpiration;
		await user.save();
		await sendCode('reset', 'password/'+code,
			<string>req.fields.name, <string>req.fields.email,
			'Registration');
		res.send('Email sent');
	}
}));
api.put('/', API(async (req: Request, res: Response)=> {	//register
	if(req.credentials)
		res.status(400).send('Already logged in');
	else if(req.fields.role === 'adm')	// User register as administrator
		res.status(403).send("Don't be evil!");
	else if(await User.findOne({email: <string>req.fields.email}))
		res.status(400).send('E-mail already registered');
	else {
		let code = randomCode(/*256*/);
		var user = new User({
			email: req.fields.email,
			name: req.fields.name,
			role: req.fields.role,
			code,
			expiration: Date.now()+codeExpiration
		});
		await user.save();
		await sendCode('register', 'password/'+code,
			<string>req.fields.name, <string>req.fields.email,
			'Registration');
		res.send('Email sent');
	}
}));
api.patch('/', API(async (req: Request, res: Response)=> {	//change password
	if(!req.credentials)
		res.status(400).send('Not logged in');
	else {
		if(md5(<string>req.fields.oldPass) === req.credentials.pass) {
			req.credentials.pass = md5(<string>req.fields.newPass);
			req.credentials.save();
			res.send('Password changed');
		} else
			res.status(403).send('Bad password verification');
	}
}));
api.delete('/', API(async (req: Request, res: Response)=> {	//delete user
	if(!req.credentials)
		res.status(400).send('Not logged in');
	else {
		const passMd5 = md5(<string>req.fields.pass);
		if(passMd5 === req.credentials.pass) {
			await User.deleteOne({email: req.credentials.email});
			logOut(req.apiKey);
			res.send('User deleted');
		} else
			res.status(403).send('Bad pass-phrase');
	}
}));