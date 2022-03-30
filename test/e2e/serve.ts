import config from '@/config';
Object.assign(config, {	// Modify global config before opening the connections
	http: {port: 4004},
	mongo: {connect: 'mongodb://localhost/specialists-test'}
});
import {initDB, destroyDB} from '../db';
import '@/index';

initDB();
