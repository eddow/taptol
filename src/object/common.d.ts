export {};

declare global {
	export type Dictionary<T = any> = {[key: string]: T};
}