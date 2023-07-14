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
	res.setHeader("Content-Type", "text/event-stream")

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
		console.log({message});
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
	console.log({chat});
	
	chatEmitter.emit('message', chatMessage);

	res.redirect('/chat/');
});

app.listen(3000, () => console.log('Listening on http://0.0.0.0:3000'));
