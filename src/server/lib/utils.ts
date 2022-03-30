import crypto from 'crypto';

export function md5(s: string) {
	return crypto.createHash('md5').update(s).digest('hex');
}

const codeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'

export function randomCode(length: number = 32) {
	var rv = '';
	while(rv.length < length)
		rv += codeChars.charAt(Math.floor(Math.random()*codeChars.length));
	return rv;
}