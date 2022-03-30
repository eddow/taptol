// A bit of complexity as `Promise` cannot be inhrited directly
export interface Semaphore<T> extends Promise<T> {
	resolve: (value: T)=> void;
	reject: (error: any)=> void;
}
export default function createSemaphore<T>(): Semaphore<T> {
	let sResolve: (value: T)=> void,
		sReject: (error: any)=> void;
	let rv: Semaphore<T> = <Semaphore<T>>new Promise<T>((resolve, reject) =>{
		sResolve = resolve;
		sReject = reject;
	});
	rv.resolve = sResolve;
	rv.reject = sReject;
	return rv;
}