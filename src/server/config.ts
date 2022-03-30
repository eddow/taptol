import {smtp} from './private';

const server = {
	// <Testing override here>
	http: {url: 'http://localhost', port: 4003},
	mongo: {connect: 'mongodb://localhost/specialists'},
	// </>
	smtp,
	root: __dirname
};
export default server;