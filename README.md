# Stream Role Bot ![](https://gitlab.com/lolPants/stream-role-bot/badges/master/build.svg)
_Discord Bot that assigns a role when someone is streaming._  
Built by [Jack Baron](https://www.jackbaron.com)

## Installation
### Prerequisites
* Docker

### Setup
1. Make sure Docker Daemon is running with `docker ps`
2. Pull the docker image:  
`docker pull registry.gitlab.com/lolpants/stream-role-bot:latest`
3. Start a Redis container:  
`docker run -d --name streamrole-data redis`  
For persistent data, make a new directory and use:  
`docker run -d --name streamrole-data -v /path/to/directory:/data redis --appendonly yes`  
where `/path/to/directory` is the full path to the directory you just created.
4. Create `streambot.env` and fill in your details *(see below)*.
5. Start the bot using:  
`docker run --restart on-failure --name streambot -d --env-file streambot.env --link streamrole-data:redis registry.gitlab.com/lolpants/stream-role-bot:master`

## `streambot.env`
To configure your bot, make a new file named `streambot.env` and fill it out as follows:
```env
TOKEN=<YOUR DISCORD BOT TOKEN>
PREFIX=%
OWNER=<YOUR DISCORD ID>
```
Feel free to change the prefix to whatever. Usage is: `%invite`  
If you wish to use a spaced prefix (eg `% invite`) then add the line `PREFIX_SPACE=true`

## Inviting to your server
1. In the [bot settings](https://discordapp.com/developers/applications/me) on Discord's site, find your bot and copy it's **Client ID**
2. Open this URL, but replace `<CLIENTID>` with your Client ID `https://discordapp.com/oauth2/authorize?scope=bot&client_id=<CLIENTID>&permissions=336006144`
3. Follow the instructions
