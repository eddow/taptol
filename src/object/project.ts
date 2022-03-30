export default class Project {
	_id?: any
	specialist: any;
	customer: any;
	description: string;
	stage: Stage;
	
	review: string;
	rate: Stars;
}

export type Stars = 1 | 2 | 3 | 4 | 5;
export var stars: number[] = [1, 2, 3, 4, 5];
export const stages = {
	prop: 'Proposal',	// Proposedby customer
	ref: 'Refused',		// Refused by specialist
	cur: 'In progress',	// Accepted and currently being done by specialist
	done: 'Done',		// Declared as done by the specialist
	val: 'Validated'	// Accepted as done by the customer and reviewed
};
export type Stage = 'prop' | 'ref' | 'cur' | 'done' | 'val';

export const projectHeader = 'Projects-Status';