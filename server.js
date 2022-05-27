
const fastify=require('fastify')({
    logger:true
});
require('dotenv').config();
const mongoose=require('mongoose');
const routes=require('./routes/routes');
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('Database Connected'))
.catch((err)=>console.log(err));

//for routes
routes.forEach((route, index)=>{
    fastify.route(route)
})

const { Client, Intents } = require('discord.js');
const token = "OTc5Nzc1OTg4Mzc4NTA1Mjg2.G03K9b.ijXqY2MAO8XR4gdvQEO9uXHStU6teypWnaiP-U";
const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]});
client.once('ready', () => {
	console.log('Ready!');
});
client.on('messageCreate', async interaction => {
    console.log("hooo");
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply('Server info.');
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});

client.login(token);

const start = async () => {
    try {
      await fastify.listen(3000)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  };
  start();