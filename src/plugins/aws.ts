import fp from 'fastify-plugin'
import * as path from "path";
import * as fs from 'fs';

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const s3client = new S3Client({
	region: process.env.AWS_DEFAULT_REGION
});

export interface awsPluginOptions {
  // Specify dbBackup plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<awsPluginOptions>(async (fastify, opts) => {
  	fastify.decorate('s3upload', function (filePath: string) {
		try{
			console.log('s3upload filePath', filePath)
			fs.readFile(filePath, async (err: any, data:any) => {
				if (err) throw err;
				const command = new PutObjectCommand({
					Bucket: process.env.AWS_BUCKET,
					Key: `db-backups/${path.basename(filePath)}`,
					Body: JSON.stringify(data, null, 2),
				});
				
				const response = await s3client.send(command);
				if(response.$metadata.httpStatusCode == 200){
					fs.unlinkSync(filePath);
					fs.rmSync(filePath.replace(/\.[^/.]+$/, ""), { recursive: true, force: true });
				}
				console.log('s3upload response', response)
				return response;
			});
		} catch (err) {
			console.error(err);
			throw err;
		}	
  	});
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    s3upload(filePath: string): void;
  }
}
