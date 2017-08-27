#!/usr/bin/env nodejs
require('dotenv').config();
const MongoClient   = require('mongodb').MongoClient;
const db            = require('./config/db');
const app           = require('./config/express');
const tBot          = require('./config/tbot');
const port          = process.env.PORT;
const tGroupId      = process.env.TELEGRAM_GROUP;

MongoClient.connect(db.url, (err, db) => {
  if (err) return console.log(err)

  app.post('/message', (req, res) => {
    db.collection('messages').insert(req.body, (err, result) => {
      if (err) {
        res.status(500).send({error: 'Ошибка отправки сообщения'});
      } else {
        res.send();
      }
    });

    tBot.sendMessage(tGroupId, `Сообщение на сайте от ${req.body.contact}: ${req.body.message}`);
  });

  app.post('/email', (req, res) => {
    db.collection('email').insert(req.body, (err, result) => {
      if (err) {
        res.status(500).send({error: 'Ошибка отправки сообщения'});
      } else {
        res.send();
      }
    });

    tBot.sendMessage(tGroupId, `Подписался на новости о школе: ${req.body.address}`);
  });

  tBot.on('message', (msg) => {
    if (msg.text.toLowerCase().indexOf('ping') === 0) {
      bot.sendMessage(msg.chat.id, 'pong!');
    }
  });

  app.listen(port, () => {
    console.log('We are live on port ' + port);
  });

})
