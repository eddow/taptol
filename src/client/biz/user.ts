import {post, put, patch, del, get} from '@/lib/ajax';
import {Role, roles, sessionTimings} from '@obj/user';
import {globals} from '@/lib/ajax';
import {AuthData, authHeader} from '@obj/auth';


export {Role, roles}
globals.prepare.push(req=> {
	let token = User.loggedIn.authToken;
	if(token)
		req.headers[authHeader] = token;
});
globals.failure.push(err=> {
	if(400<= err.status && err.status< 500) {
		let user = User.loggedIn;
		if(401=== err.status)
			user.authToken = null;
		user.reloadUser();
		return true;
	}
});
export class User {
	public desktop: boolean;	// maintained by app.vue
	public name: string;
	public _id: string;
	public role: Role = null;
	private static instance: User;
	public get authToken(): string {
		return localStorage.getItem('auth-token');
	};
	public set authToken(v: string) {
		if(v) localStorage.setItem('auth-token', v);
		else localStorage.removeItem('auth-token');
	};
	private constructor() {
		User.instance = this;
		this.reloadUser();
	}
	public reloadUser() {
		if(this.authToken) {
			this.init = get('user').then((auth: AuthData)=> {
				this._id = auth._id;
				this.name = auth.name;
				this.role = auth.role;
				this.regularPing = true;
			}).catch((x: any)=> {
				if(x && 401=== x.status) {
					this.authToken = null;
					this.name = '';
					this.role = 'anon';
					this.regularPing = false;
				} else throw x;
			});
		} else {
			this.name = '';
			this.role = 'anon';
			this.init = Promise.resolve();
			this.regularPing = false;
		}
	}
	public static get loggedIn(): User {
		return this.instance || new User();
	}
	pingInterval: any = null;
	set regularPing(v: boolean) {
		if(v && !this.pingInterval)
			this.pingInterval = setInterval(()=> get(), sessionTimings.ping);
		else if(!v && this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
	}
	get regularPing(): boolean {
		return !!this.pingInterval;
	}
	private init: Promise<any>;
	public initialised(): Promise<any> { return this.init; }
	get home() {
		return ('adm'=== this.role && this.desktop) ? '/users' :
			'spec'=== this.role ? '/services' :
			'/specialists';
	}
	private async authed(p: Promise<AuthData>) {
		let auth: AuthData = await p;
		this.name = auth.name;
		this.role = auth.role;
		this.authToken = auth.authToken;
		this.regularPing = true;
	}
	login(email: string, pass: string) {
		return this.authed(post<AuthData>('user', {email, pass}));
	}
	register(name: string, email: string, role: Role) {
		return put('user', {name, email, role});
	}
	resetPw(email: string) {
		return post('user/pwc', {email});
	}
	setPassword(code: string, pass: string) {
		return this.authed(put('user/pwc', {code, pass}));
	}
	changePass(oldPass: string, newPass: string) {
		return patch('user', {oldPass, newPass});
	}
	async logout() {
		await post('user');
		this.authToken = null;
		this.name = '';
		this.role = 'anon';
		this.regularPing = false;
	}
	delete(pass?: string) {
		return del('user', {pass});
	}
}

export default User.loggedIn;