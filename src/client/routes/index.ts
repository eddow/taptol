import user from '@/biz/user';
import {RouteConfig, Route} from 'vue-router/types';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Login from './login.vue';
import Register from './register.vue';
import UserCfg from './userCfg.vue';
import Services from './services.vue';
import Service from './service.vue';
import Users from './users.vue';
import Specialists from './specialists.vue';
import Specialist from './specialist.vue';
import Proposal from './proposal.vue';
import Projects from './projects.vue';
import User from './user.vue';
import Password from './password.vue';
import * as kebab from 'kebab-case';

const routes: RouteConfig[] = [{
	path: '*',
	redirect: (to: Route)=> user.home
}, {
	path: '/lost-pw',
	name: 'lost-pw',
	component: Register,
	meta: {
		auth: undefined
	}
}];

const components = {Login, Register, Password, UserCfg, Services, Service,
	Specialists, Specialist, Proposal, Projects, Users, User};
for(let comp in components) {
	let name = kebab(comp),
		component = components[comp];
	if(name[0] === '-') name = name.substr(1);
	let route: RouteConfig = {
		path: `/${name}`,
		name,
		component,
		meta: {
			auth: component.auth
		}
	};
	if(component.params) {
		route.path += '/:' + component.params.join('/:');
		route.props = true
	}
	routes.unshift(route);
}
const router = new VueRouter({
	mode: 'history',
	routes
});
export default router;
router.beforeEach((to, from, next) => {
	const auth = to.meta.auth;
	
	if (auth && !auth.includes(user.role))
		return next({path: user.home});

	next();
});