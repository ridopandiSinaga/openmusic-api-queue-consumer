require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsServices = require('./PlaylistsServices');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const playlistService = new PlaylistsServices();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();
