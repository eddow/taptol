import {expect} from 'chai';
import {get, put, post, patch, del} from './http'

describe('ping-pong', function() {
	it('ping', async ()=> {
		let res = await get('/@');
		expect(res.status).to.eql(200);
	});
	it('raises', async ()=> {
		let res = await get('/@/nope');
		expect(res.status).to.eql(404);
	});
});

describe('logs in - or not', function() {
	it('refuses login', async ()=> {
		let res = await post('/@/user/', {email: 'adm@s.pec', pass: 'pw-invalid'});
		expect(res.status).to.eql(403);

	});
	let authToken: string;
	it('logs-in', async ()=> {
		let res = await post('/@/user/', {email: 'adm@s.pec', pass: 'pw-adm'});
		expect(res.status).to.eql(200);
		expect(res.body.name).to.eql('Admin');
		authToken = res.body.authToken;
	});
	it('does not double log-in', async ()=> {
		let res = await post('/@/user/', {email: 'adm@s.pec', pass: 'pw-adm'}, authToken);
		expect(res.status).to.eql(400);
	});
	it('log-out', async ()=> {
		let res = await post('/@/user/', undefined, authToken);
		expect(res.status).to.eql(200);
	});
	it('does not double log-in', async ()=> {
		let res = await post('/@/user/', undefined, authToken);
		expect(res.status).to.eql(401);
		res = await post('/@/user/');
		expect(res.status).to.eql(400);
	});
	
});