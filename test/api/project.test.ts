import {expect} from 'chai';
import {get, put, post, patch, del, logIns, logOuts, Auth} from './http'
import ID from '../id'

describe('project movement', async function() {
	let auth: Auth;
	before(async ()=> auth = await logIns());
	after(()=> logOuts(auth));
	it('refuses', async ()=> {
		let propose = (await post('/@/project/', {
			specialist: ID('specialist1'),
			description: 'Test refused project'
		}, auth.cust));
		expect(propose.status).to.eql(200);
		expect(propose.projectStatus).to.eql({prop: 2});
		let projectId = propose.body;

		let refuse = (await patch('/@/project/'+projectId, {
			accepted: false
		}, auth.spec));
		expect(refuse.status).to.eql(200);
		expect(refuse.projectStatus).to.eql({prop: 1, ref: 1});
	});
});