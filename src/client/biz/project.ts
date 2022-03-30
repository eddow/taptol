import {post, put, patch, del, get} from '@/lib/ajax';
import ProjectBase, {Stars, Stage} from '@obj/project';

export default class Project extends ProjectBase {
	static list(stage: Stage): Promise<Project[]> {
		return get<Project[]>('project/' +stage);
	}
	static usrList(side: 'cust' | 'spec', user: string): Promise<Project[]> {
		return get<Project[]>(`project/${side}/${user}`);
	}
	static post(specialist: string, description: string): Promise<void> {
		return post<void>('project', {specialist, description});
	}
	static reopen(id: string): Promise<void> {
		return patch<void>('project/'+id);
	}
	static review(id: string, review?: string, rate?: number): Promise<void> {
		return patch<void>('project/'+id, {review, rate});
	}
	static finish(id: string): Promise<void> {
		return patch<void>('project/'+id);
	}
	static accept(id: string, accepted: boolean): Promise<void> {
		return patch<void>('project/'+id, {accepted});
	}
	static save(id: string, changes: any): Promise<void> {
		return put<void>('project/'+(id||''), changes);
	}
	static del(id: string): Promise<void> {
		return del<void>('project/'+id,);
	}
}
