import config from '@/config';
import {readFileSync} from 'fs';
import {join} from 'path';
import {createTransport} from 'nodemailer';

export type mailType = 'register' | 'reset';
const transporter = createTransport(<any>{
	host: config.smtp.host,
	port: config.smtp.port,
	auth: config.smtp.auth
})

export default async function sendCode(
	type: mailType, rel: string, name: string, email: string, subject: string
): Promise<void> {
	const fName = join(config.root, '/doc', type),
		mailOptions = {
			from: config.smtp.sender,
			to: `"${name}" <${email}>`,
			subject,
			html: readFileSync(fName+'.html', {encoding: 'utf8'}),
			text: readFileSync(fName+'.txt', {encoding: 'utf8'})
		};
	let url = `${config.http.url}:${config.http.port}/${rel}`;
	for(let type of ['text', 'html'])
		mailOptions[type] = mailOptions[type].replace(/\$\{url\}/g, url);
	return new Promise<void>(
		(resolve: (value: void)=> void, reject: (reason: any)=> void)=> {
			transporter.sendMail(mailOptions, function(error){
				if(error) reject(error); else resolve();
			});
		});
}
