# Backup and Restore MongoDB

#### Features

- HTML UI for backups listings
- Scheduler for background backups
- One click backups and restore

#### TO DO

- Download and delete backups from machine
- Shift backups to remote storage


##### Please Note:  
***Backups and Restore may take some time according to your datasize. To check real time status you need to keep eyes on your terminal. UI is just for files handeling. It will not give you real time update experience while you will click on backup and restore actions.*** 

#### Installation

App requires [Node.js](https://nodejs.org/) v10+ to run.

To set your database url modify **/config.yaml** file
To change the cron job frequency modify **/src/plugins/scheduler.ts** file

To run the application

1. Install the dependencies and devDependencies 
2. create .env file and update configs
3. create conf.yaml file and configs  
4. and start the server.

```sh
git clone https://github.com/raviroshanmehta/mongo-backup-restore.git
cd mongo-backup-restore
npm i
cp .env.example .env
cp conf.yaml.example conf.yaml
npm run start
```