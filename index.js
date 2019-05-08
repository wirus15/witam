const moment = require('moment');
const {ajax} = require('rxjs/ajax');
const {from} = require('rxjs');
const {map, switchMap, filter, reduce} = require('rxjs/operators');
const {XMLHttpRequest} = require('xmlhttprequest');

const config = require('./config');
const slack = require('./slack')(config);
const yesterday = moment().subtract(1 ,'day');
const url = `https://a2.wykop.pl/Tags/Entries/${config.tag}/page/1/appkey/${config.wykopApiKey}`;
const createXHR = () => new XMLHttpRequest();

ajax({url, createXHR}).pipe(
    switchMap(response => from(response.response.data)),
    filter(entry => moment(entry.date).isSame(yesterday, 'day')),
    filter(entry => entry.embed && entry.embed.type === 'image'),
    reduce((current, next) => !current || next.vote_count > current.vote_count ? next : current),
    map(entry => entry.embed.url)
).subscribe(imgUrl => slack.send(imgUrl));
