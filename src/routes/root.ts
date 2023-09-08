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
    return { backup : true, message: 'Request processed. Please check your terminal for realtime status.' }
  })
  fastify.get('/restore/:backupfile', async function (request: any, reply: any) {
    fastify.dbRestore(request.params.backupfile as string);
    return { restore : true, message: 'Request processed. Please check your terminal for realtime status.' }
  })
  fastify.get('/remove/:backupfile', async function (request: any, reply: any) {
    const backupfile = request.params.backupfile as string;
    const backupPath = join(__dirname, "../../backups"); 
    if(backupfile == 'all'){
      const files = fs.readdirSync(backupPath);
      files.shift();
      files.forEach(function(file,i){
        fs.unlinkSync(join(backupPath, file));
      });
    } else {
      fs.unlinkSync(join(backupPath, backupfile));
    }
    reply.redirect('/')
  })
  fastify.get('/download/:backupfile', async function (request: any, reply: any) {
    const backupfile = request.params.backupfile as string;
    return reply.sendFile(backupfile)
  })
}

export default root;
