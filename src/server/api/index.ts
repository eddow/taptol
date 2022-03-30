import User from './user';
import Specialist from './specialist';
import Service from './service';
import Admin from './admin';
import Project, {projectsCount} from './project';
import express from 'express';
import {Request, Response} from 'express';
import {apiKeyAuthentication} from '@/lib/auth';

const api = express();
export default api;

var apis = {User, Specialist, Service, Admin, Project};
api.use(projectsCount);
api.use(apiKeyAuthentication);
api.get('/@', function(req: Request, res: Response) {
	res.status(200).send(/*pong*/);
});
for(let i in apis)
	api.use(`/@/${i.toLowerCase()}`, apis[i]);
api.use('/@/*', function(req: Request, res: Response) {
	res.status(404).send('Invalid API');
});
