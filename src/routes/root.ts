import { FastifyPluginAsync } from 'fastify'
import { join } from 'path';
import * as fs from 'fs';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request: any, reply: any) {
    const backupPath = join(__dirname, "../../backups"); 
    const files = fs.readdirSync(backupPath);
    files.shift()
    files.reverse()
    return reply.view("index.ejs", { files });
  })
  fastify.get('/backup', async function (request: any, reply: any) {
    fastify.dbBackup();
    return { backup : true }
  })
  fastify.get('/restore/:backupfile', async function (request: any, reply: any) {
    fastify.dbRestore(request.params.backupfile as string);
    return { restore : true }
  })
}

export default root;
