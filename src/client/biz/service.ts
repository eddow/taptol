import {put, del, get} from '@/lib/ajax';
import ServiceBase, {instanciateService} from '@obj/service';

export default class Service extends ServiceBase {
	static async list(): Promise<Service[]> {
		return (await get<Service[]>('service')).map(instanciateService);
	}
	static create(service: Service): Promise<void> {
		return put<void>('service', service);
	}
	static async get(id: string): Promise<Service> {
		return instanciateService(await get<Service>(`service/${id}`));
	}
	static modify(id: string, service: Service): Promise<void> {
		return put<void>(`service/${id}`, service);
	}
	static del(id: string): Promise<void> {
		return del<void>(`service/${id}`);
	}
}
