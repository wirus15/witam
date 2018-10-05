const HipChatRoomNotification = require('hipchat-room-notification-api');
const config = require('./config');
const hipChatRoomNotification = new HipChatRoomNotification(config.domain, config.roomId, config.authToken);

hipChatRoomNotification.setColor('green');
hipChatRoomNotification.shouldNotify();
hipChatRoomNotification.setMessage('hejka (hehe)');

hipChatRoomNotification.send()
    .then((result) => {
        console.log({result});
    }).catch((error) => {
        console.log({error});
    });
