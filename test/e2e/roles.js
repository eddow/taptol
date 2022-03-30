import {Role} from 'testcafe';

export const specUser = Role('http://localhost:4004/login', async t => {
	await t
		.typeText('input[name="email"]', 'spec@s.pec')
		.typeText('input[name="passPhrase"]', 'pw-spec')
		.click('button[type="submit"]');
});

export const custUser = Role('http://localhost:4004/login', async t => {
	await t
		.typeText('input[name="email"]', 'cust@s.pec')
		.typeText('input[name="passPhrase"]', 'pw-cust')
		.click('button[type="submit"]');
});

export const admin = Role('http://localhost:4004/login', async t => {
	await t
		.typeText('input[name="email"]', 'adm@s.pec')
		.typeText('input[name="passPhrase"]', 'pw-adm')
		.click('button[type="submit"]');
});