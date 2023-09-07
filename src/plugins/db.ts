const { spawn } = require('child_process');
import { join } from 'path';
import fp from 'fastify-plugin'

export interface dbBackupPluginOptions {
  // Specify dbBackup plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<dbBackupPluginOptions>(async (fastify, opts) => {
  fastify.decorate('dbBackup', function () {
    const configFile = join(__dirname, "../../conf.yaml");
    const backupPath = join(__dirname, "../../backups"); 
    const backupFileName = `backup_${new Date().getTime()}`;
    
    const archive = join(backupPath, backupFileName + '.gz');
    const backupCommand = `mongodump --config=${configFile} --archive=${archive} --gzip`;
    
    // const outDir = join(backupPath, backupFileName);
    // const backupCommand = `mongodump --config=${configFile} --out=${outDir}`;

    const backupProcess = spawn(backupCommand, { shell: true });
    backupProcess.stdout.on('data', (data: any) => {
      console.log(`Backup process output: ${data}`);
    });
    backupProcess.stderr.on('data', (data: any) => {
      console.error(`Backup processing: ${data}`);
    });
    backupProcess.on('close', (code: any) => {
      let msg = ``;
      if (code === 0) {
        // fastify.s3upload(archive);
        msg = 'Backup completed successfully.';
        console.log(msg);
      } else {
        msg = `Backup process exited with code ${code}.`;
        console.error(msg);
      }
      return msg;
    });
  })
  fastify.decorate('dbRestore', async function (backupFileName) {
    const configFile = join(__dirname, "../../conf.yaml");
    const backupPath = join(__dirname, "../../backups"); 
    
    const archive = join(backupPath, backupFileName + '.gz');
    const restoreCommand = `mongorestore --config=${configFile} --archive=${archive} --gzip`;
    
    // const outDir = join(backupPath, backupFileName);
    // const backupCommand = `mongorestore --config=${configFile} --out=${outDir}`;

    const restoreProcess = spawn(restoreCommand, { shell: true });
    restoreProcess.stdout.on('data', (data: any) => {
      console.log(`Restore process output: ${data}`);
    });
    restoreProcess.stderr.on('data', (data: any) => {
      console.error(`Restore processing: ${data}`);
    });
    restoreProcess.on('close', (code: any) => {
      let msg = ``;
      if (code === 0) {
        msg = 'Restore completed successfully.';
        console.log(msg);
      } else {
        msg = `Restore process exited with code ${code}.`;
        console.error(msg);
      }
      return msg;
    });
  })
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    dbBackup(): any;
    dbRestore(backupFileName: string): any;
  }
}
