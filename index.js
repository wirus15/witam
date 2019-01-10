const config = require('./config');
const jsdom = require("jsdom");
const moment = require('moment');
const { JSDOM } = jsdom;

const yesterday = moment().subtract(1 ,'day');

const getPoints = (node) => node.querySelector('p.vC').getAttribute('data-vc');
const getDate = (node) => node.querySelector('time').getAttribute('datetime');
const hasImg = (node) => Boolean(node.querySelector('.media-content > a[href$=".jpg"], .media-content > a[href$=".png"], .media-content > a[href$=".gif"]'));
const fromYesterday = (node) => moment(getDate(node)).isSame(yesterday, 'day');

const send = {
    hipchat: (imgUrl) => {
        const HipChatRoomNotification = require('hipchat-room-notification-api');

        const helloMsg = new HipChatRoomNotification(config.domain, config.roomId, config.authToken);
        helloMsg.setColor(config.color);
        helloMsg.shouldNotify();
        helloMsg.setTextMessageFormat();
        helloMsg.setMessage(config.message);
        helloMsg.send();

        const imgMsg = new HipChatRoomNotification(config.domain, config.roomId, config.authToken);
        imgMsg.setColor(config.color);
        imgMsg.setMessage(`<img src="${imgUrl}">`);
        imgMsg.send();
    },
    slack: (imgUrl) => {
        const { WebClient } = require('@slack/client');
        const client = new WebClient(config.authToken);

        client.chat.postMessage({
            channel: config.roomId,
            attachments: [{
                text: config.message,
                color: config.color,
                image_url: imgUrl,
            }],
        });
    }
};

JSDOM.fromURL(`https://www.wykop.pl/tag/wpisy/${config.tag}/`).then((result) => {
    let entries = Array.from(result.window.document.querySelectorAll('#itemsStream > .entry.iC'));

    entries = entries.filter(hasImg);
    entries = entries.filter(fromYesterday);
    entries.sort((a, b) => getPoints(b) - getPoints(a));

    const imgUrl = entries[0].querySelector('.media-content > a').getAttribute('href');

    if (send[config.app] === undefined) {
        throw Error(`Unknown application: ${config.app}`);
    }

    send[config.app](imgUrl);
});
