export type Role = 'anon' | 'cust' | 'spec' | 'adm';
export const roles: {[key: string]: string} = {
	cust: 'Customer',
	spec: 'Specialist',
	adm: 'Admininstrator'
};

export default class User {
	_id?: any;
	role: Role;
	name: string;
	email: string;
	pass: string;
}

const sessionTimings = {
	// The amount of time the session is alife without interactions
	lifespan: 60*60*1000,
	// How often the server eliminates expired sessions
	interval: 10*60*1000,
	// How often the client pings to refresh the session (and keep projects nr up-to-date)
	ping: 10*60*1000
};
export {sessionTimings};