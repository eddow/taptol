import {post, put, patch, del, get} from '@/lib/ajax';
import User from '@obj/user';

export default class UserAdmin {
	static list(): Promise<User[]> {
		return get<User[]>('admin');
	}
	static get(id: any): Promise<User> {
		return get<User>('admin/'+id);
	}
	static lookup(role: 'spec'|'cust'): Promise<User> {
		return get<User>('user/'+role);
	}
	static save(id: any, changes: any): Promise<void> {
		return put<void>('admin/'+(id||''), changes);
	}
	static del(id: any): Promise<void> {
		return del<void>('admin/'+id);
	}
	static changePassword(id: any, newPass: string) {
		return patch('admin/'+id, {newPass});
	}
}