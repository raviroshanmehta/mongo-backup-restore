import fp from 'fastify-plugin'

import { fastifySchedule } from '@fastify/schedule';
import { SimpleIntervalJob, Task } from 'toad-scheduler';

export interface schedulerPluginOptions {
	// Specify schedulerPluginOptions plugin options here
}

// const isProd = process.env.NODE_ENV === 'production';

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<schedulerPluginOptions>(async (fastify) => {
	fastify.register(fastifySchedule);

	const db_backup = new Task(
        'db_backup',
        async () => {
            console.info('db_backup started at', new Date());
            fastify.dbBackup();
        },
        (err) => {
            console.error('db_backup err', err);
            fastify.log.error(err);
        },
    );

	const db_backup_job = new SimpleIntervalJob({
        runImmediately: false, //(isProd !== true)
        seconds: 1 * 24 * 60 * 60,
    }, db_backup);
    // console.log(db_backup_job);
	fastify.ready().then(() => {
        fastify.scheduler.addSimpleIntervalJob(db_backup_job);
    });
})
