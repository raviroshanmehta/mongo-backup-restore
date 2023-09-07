# Backup and Restore MongoDB

## Features

- HTML UI for backups listings
- Scheduler for background backups
- One click backups and restore

## TO DO

- Download and delete backups from machine
- Shift backups to remote storage

## Installation

App requires [Node.js](https://nodejs.org/) v10+ to run.

To set your database url modify **/config.yaml** file
To change the cron job frequency modify **/src/plugins/scheduler.ts** file

Install the dependencies and devDependencies and start the server.

```sh
cd mongo-backup-restore
npm i
npm run start
```


