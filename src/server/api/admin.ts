import express from 'express';
import {Request, Response} from 'express';
import {md5} from '@/lib/utils';
import {User} from '@/biz/user';
import {auth, sanitizer} from '@/lib/api';

const sanitize = sanitizer('_id', 'name', 'role', 'email')

var api = express();
export default api;

api.get('/', auth('adm', async (req: Request, res: Response)=> {
	res.send((await User.find().lean()).map(sanitize));
}));
api.get('/:id', auth('adm', async (req: Request, res: Response)=> {
	res.send(sanitize(await User.findOne({_id: req.params.id}).lean()));
}));
api.put('/:id', auth('adm', async (req: Request, res: Response)=> {
	let user = await User.findOne({_id: req.params.id});
	if(!user) return res.status(404).send('User not found');
	Object.assign(user, req.fields);
	await user.save();
	res.send('User modified');
}));
api.put('/', auth('adm', async (req: Request, res: Response)=> {
	let user = new User();
	Object.assign(user, req.fields);
	await user.save();
	res.send(user._id);
}));
api.delete('/:id', auth(['adm'], async (req: Request, res: Response)=> {
	await User.deleteOne({_id: req.params.id});
	res.send('User deleted');
}));
api.patch('/:id', auth(['adm'], async (req: Request, res: Response)=> {
	if(req.fields.newPass.length < 6)
		return res.status(400).send('The password must contain at least 6 characters');
	let user = await User.findOne({_id: req.params.id});
	if(!user) return res.status(404).send('User not found');
	user.pass = md5(<string>req.fields.newPass);
	user.save();
	res.send('Password changed');
}));