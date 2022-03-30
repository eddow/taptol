import 'fomantic-ui/dist/semantic.css';
import * as $ from 'jquery';
(<any>window).jQuery = $;
import 'fomantic-ui';
import 'reflect-metadata';

import App from '@/components/app.vue';
import user from '@/biz/user';
import router from './routes';
import '@/components';

async function load() {
	await user.initialised();
	new App({
		router,
		el: 'app'
	});
}
load();