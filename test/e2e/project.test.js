import {Selector} from 'testcafe';
import {specUser, custUser, admin} from './roles'

fixture `Specialists`
	.page `http://localhost:4004/login`;

test('propose', async t => {
	await t
		.useRole(specUser);
		
	let nrProp = + await Selector('.ui.red.label').innerText,
		prjDesc = `test-project-${nrProp}`;
		
	await t
		.useRole(custUser)
		.click('.specialists-route table td.content a') // => McSpec
		.click('.ui.right.floated.primary.icon.button') // => Request for a project
		.typeText('textarea[name="description"]', prjDesc)	// Enters project description
		.click('button[type="submit"]')	// submit
		.useRole(specUser)
		// See the notification label
		.expect(Selector('.ui.red.label').innerText).eql(''+(++nrProp))
		.click('.ui.red.label')
		// See the proposed project
		.expect(Selector('.project-ctl .description').withText(prjDesc).exists)
		.ok();
});