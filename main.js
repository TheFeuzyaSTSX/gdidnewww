const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg")

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
  console.log("Pret !");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("Vous devez entrer une commande valide !");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Vous devez être dans un canal vocal pour écouter de la musique !"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "J'ai besoin des autorisations pour rejoindre et parler dans votre canal vocal !"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} a été ajouté à la file d'attente! `);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Vous devez être dans un canal vocal pour arrêter la musique !"
    );
  if (!serverQueue)
    return message.channel.send("Il n'y a aucune chanson que je pourrais sauter !");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Vous devez être dans un canal vocal pour arrêter la musique !"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Commencer à jouer: **${song.title}**`);
}

client.on('ready', () => {
  client.user.setActivity('A votre servis :)')
})

// CODE DE GDID
// Liste des créateurs
client.on('message', msg => {
  if (msg.content === '$creator') {
    msg.reply('JonathanGD, JustL30, Dorami, Mulpan');
  }
});

// Liste des niveux des créateurs 
 
client.on('message', msg => {
  if (msg.content === '$creator JustL30') {
    msg.reply('Phenomena');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD') {
    msg.reply('Future Funk II, BuTiTi III, Biru, The Lost Existence, Future Funk, Ocular Miraclepkkidn, BuTiTi II, Crystalia, Dark Travel, Hoopity, Lch Megacollab 7, For Olympic 10, The Game, The Farewall, Instant Preview 2, Discordant, Rambreaker, BuTiTi, Beyond The Nature, Beginning of Climax, Retry, Geometrical Begins, The Memories, Ultra Demoncore, Cloudy Aventures, Garden Land, Theory of Angel, New Style Madness');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator Mulpan') {
    msg.reply('Multition, Auto, The Antagonist');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator Dorami') {
    msg.reply('The Yandere, Azure Fiesta');
  }
});

// l'id des niveux


client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Future Funk II') {
    msg.reply('59626284');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD BuTiTi III') {
    msg.reply('57433866');
  }
});


client.on('message', msg => {
  if (msg.content === '$creator Dorami The Yandere') {
    msg.reply('54615662');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator Dorami Azure Fiesta') {
    msg.reply('60923124');
  }
});


client.on('message', msg => {
  if (msg.content === '$creator JustL30 Phenomena') {
    msg.reply('55149133');
  }
});


client.on('message', msg => {
  if (msg.content === '$creator Mulpan Multition') {
    msg.reply('60660086');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator Mulpan Auto') {
    msg.reply('61036328');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator Mulpan The Antagonist') {
    msg.reply('61927721');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Biru') {
    msg.reply('47611766');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD The Lost Existence') {
    msg.reply('');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Future Funk') {
    msg.reply('44062068');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Ocular Miraclepkkidn') {
    msg.reply('38725630');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD BuTiTi II') {
    msg.reply('37259527');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Crystalia') {
    msg.reply('37195776');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Dark Travel') {
    msg.reply('32885972');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Hoopity') {
    msg.reply('32885691');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Lch Magecollab 7') {
    msg.reply('30024020');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD For Olmpic 10') {
    msg.reply('29761899');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD The Game') {
    msg.reply('29094819');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD The Farwell') {
    msg.reply('28352064');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Instant Preview 2') {
    msg.reply('27066763');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Discordant') {
    msg.reply('25687007');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Rambreaker') {
    msg.reply('24736896');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD BuTiTi') {
    msg.reply('21614835');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Beyond The Nature') {
    msg.reply('18515822');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Beginning of Climax') {
    msg.reply('185874493');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Retry') {
    msg.reply('13874111');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Geometrical Begins') {
    msg.reply('12235412');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD The Memories') {
    msg.reply('10125647');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Ultra Demoncore') {
    msg.reply('9504714');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Cloudy Adventures') {
    msg.reply('7735108');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Garden Land') {
    msg.reply('7245147');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD Theory of Angel') {
    msg.reply('6523764');
  }
});

client.on('message', msg => {
  if (msg.content === '$creator JonathanGD New Style Madness') {
    msg.reply('5725007');
  }
});

client.login('NzcwNjc2NzA4NjA4NTczNDQw.X5hCnQ.aHfqKd5f9sg8NC_vcBiv7AqTt0Y');