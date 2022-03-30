import config from '@/config';
Object.assign(config, {	// Modify global config before opening the connections
	http: {port: false},
	mongo: {connect: 'mongodb://localhost/specialists-test'}
});
import {initDB, destroyDB} from '../db';
import {use} from 'chai';
import chaiHttp from 'chai-http';

use(chaiHttp);
before(initDB);
after(destroyDB);