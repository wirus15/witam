const {WebClient} = require('@slack/client');

module.exports = (config) => {
    const client = new WebClient(config.authToken);

    const send = (imgUrl) => {
        client.chat.postMessage({
            channel: config.roomId,
            attachments: [{
                text: config.message,
                color: config.color,
                image_url: imgUrl,
            }],
        });
    };

    return {send};
};
