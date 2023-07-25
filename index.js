// @ts-check

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'));

/**
 * Simple server -> client messaging
 */
app.get('/server-time/sse', async (req, res) => {
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader("Connection", "keep-alive")

	while (true) {
		res.write(`event: date\ndata: ${new Date().toISOString()}\n\n`);
		await new Promise(res => setTimeout(res, 1000))
		if (req.socket.closed) break;
	}
})


/**
 * Multi-client chat / message passing between clients
 */
const events = require('node:events');

const chatEmitter = new events.EventEmitter();

/**
 * @type {string[]}
 */
let chat = [];

app.get('/chat/chatlog', async (_, res) => {
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader("Connection", "keep-alive")

	res.flushHeaders();

	chat.forEach(c => res.write(`event: message\ndata: ${c}\n\n`))


	const listener = (message) => {
		if (res.socket?.closed) {
			chatEmitter.off('message', listener)
			return
		}

		res.write(`event: message\ndata: ${message}\n\n`);
	};
	chatEmitter.on('message', listener);
});

app.post('/chat/message', (req, res) => {
	const message = req.body.message;
	const username = req.body.username;

	if (!username || !message) {
		return;
	}

	let chatMessage = `${username}: ${message}`;

	chat.push(chatMessage);
	chat = chat.slice(-10)
	
	chatEmitter.emit('message', chatMessage);

	res.redirect('/chat/');
});


/**
 * Ads
 */

function makeAd(title, subtitle, imgSrc, imgAlt) {
	return {
		title,
		subtitle,
		imgSrc,
		imgAlt
	}
}

let ads = [
	makeAd('Source Allies', 'The preferred workplace for collaborative technologists seeking mastery', 'https://www.sourceallies.com/img/dark-jumbotron/home.png', 'Technologist working at a laptop'),
	makeAd('Google', 'Google it!', 'https://lh3.googleusercontent.com/d_S5gxu_S1P6NR1gXeMthZeBzkrQMHdI5uvXrpn3nfJuXpCjlqhLQKH_hbOxTHxFhp5WugVOEcl4WDrv9rmKBDOMExhKU5KmmLFQVg', 'Google logo'),
	makeAd('Twitter', 'Who was supposed to pay rent?', 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*u1atDFEKcHCLwCVB-dGysQ.jpeg', 'a headstone for twitter'),
]

app.get('/billboard/sse', async (req, res) => {
	res.setHeader("Cache-Control", "no-cache")
	res.setHeader("Content-Type", "text/event-stream")
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader("Connection", "keep-alive")

	res.flushHeaders();

	let idx = 0

	while (true) {
		res.write(`event: ad\ndata: ${JSON.stringify(ads[idx])}\n\n`)
		await new Promise(res => setTimeout(res, 5000))
		if (req.socket.closed) break;
		idx += 1
		idx = idx % ads.length
	}
});

app.listen(3000, () => console.log('Listening on http://0.0.0.0:3000'));
