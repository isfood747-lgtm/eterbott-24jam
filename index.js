const express = require('express');
const app = express();
const admin = require('firebase-admin');
const { Client, GatewayIntentBits } = require('discord.js');

// Pintu buat UptimeRobot (Biar 24 Jam)
app.get('/', (req, res) => res.send('Bot Online!'));
app.listen(3000, () => console.log('Server Web Siap!'));

// Setup Bot Discord
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const serviceAccount = {
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

const db = admin.database();

client.once('ready', () => console.log(`✅ BERHASIL: ${client.user.tag} Online!`));

db.ref('messages').on('child_added', (snapshot) => {
  const data = snapshot.val();
  const channel = client.channels.cache.get(process.env.CHANNEL_ID);
  if (channel && data.text) {
    channel.send(`**${data.username}:** ${data.text}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
