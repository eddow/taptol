import {Role} from './user';

export const authHeader = 'Auth-Token';

export interface AuthData {
	authToken?: string;
	_id: string;
	name: string;
	role: Role;
}