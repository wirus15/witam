const HipChatRoomNotification = require('hipchat-room-notification-api');
const config = require('./config');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

JSDOM.fromURL(`https://www.wykop.pl/tag/wpisy/${config.tag}/`).then((result) => {
    let entries;
    const getPoints = (node) => node.querySelector('p.vC').getAttribute('data-vc');
    const hasImg = (node) => {
        const mediaContent = node.querySelector('.media-content');

        if (!Boolean(mediaContent)) {
            return false;
        }

        return Boolean(mediaContent.querySelector('a[href$=".jpg"],a[href$=".png"],a[href$=".gif"]'));
    };

    entries = Array.from(result.window.document.querySelectorAll('#itemsStream > .entry.iC'));
    entries = entries.filter(hasImg);
    entries.sort((a, b) => getPoints(b) - getPoints(a));

    const imgUrl = entries[0].querySelector('.media-content > a').getAttribute('href');

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
});
