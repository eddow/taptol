import express from 'express';
import {Request, Response} from 'express';
import morgan from 'morgan';
import api from './api';
import {join} from 'path';
import formidable from 'express-formidable';
import config from './config';

export const app = express();
app.use(morgan('dev'));
app.use(formidable());

app.use(express.static('./dist/client'));

app.use('/', api);

app.use(function(req: Request, res: Response) {
	res.sendFile(join(process.cwd(), './dist/client/index.html'));
});

if(config.http.port)	//false when testing
	app.listen(config.http.port, ()=> console.log(`Listening on port ${config.http.port}`));
