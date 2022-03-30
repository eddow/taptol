// Hours are numbers [0..24[. example: 8.5 -> "8:30"
export default class Service {
	specialist: any;
	type: ServiceType;
	rate: number;
	description: string;
	startHour: number;
	endHour: number;
	get startHourTime(): string { return hour2time(this.startHour); }
	set startHourTime(t: string) { this.startHour = time2hour(t); }
	get endHourTime(): string { return hour2time(this.endHour); }
	set endHourTime(t: string) { this.endHour = time2hour(t); }
}

function figs2(n: number): string {
	return (n<10?'0':'')+n;
}
export function hour2time(hour: number): string {
	if('number'!== typeof hour) return;
	let h = Math.floor(hour);
	return figs2(h)+':'+figs2(Math.round(60*(hour-h)));
}
//Note: no validation
export function time2hour(time: string): number {
	if('string'!== typeof time) return;
	let t = time.split(':');
	return +t[0] + (+t[1])/60;
}
/**
 * [client-side needed for hours mgt] Make sure to have an instance of `Service` with these data
 * @param data Inital values
 * @returns Service
 */
export function instanciateService(data: any) {
	var rv = new Service();
	Object.assign(rv, data);
	return rv;
}
export type ServiceType = 'rpr' | 'crp' | 'cln' | 'dem' | 'mpr' | 'lnd' | 'mov' | 'oth';
export const serviceTypes: {[key: string]: string} = {
	rpr: 'Car repair',
	crp: 'Carpentry',
	cln: 'Cleaning',
	dem: 'Demolition',
	mpr: 'Improvement',
	lnd: 'Landscaping',
	mov: 'Moving',
	oth: 'Other'
};
