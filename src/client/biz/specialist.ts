import {get} from '@/lib/ajax';
import Service, {instanciateService} from '@obj/service';
import Project from '@obj/project';
import User from '@obj/user'

export default class Specialist extends User {
	static async list(): Promise<Specialist[]> {
		return (await get<Specialist[]>('specialist')).map(s=> {
			s.services = s.services.map(instanciateService);
			return s;
		});
	}
	static async get(id: string): Promise<Specialist> {
		let rv = await get<Specialist>(`specialist/${id}`);
		rv.services = rv.services.map(instanciateService);
		return rv;
	}
	rating: number;
	services: Service[];
	projects: Project[];
}
