const ws = require('ws');
const PORT = 5000;
const wss = new ws.WebSocketServer({
  port: PORT,
}, () => console.log(`Server started on port ${PORT}...`));

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    message = JSON.parse(message);
    switch (message.event) {
      case 'message':
        broadcastMessage(message);
        break;
      case 'connection':
        broadcastMessage(message);
        break;
    }
  })
});

function broadcastMessage(message) {
  wss.clients.forEach(client => client.send(JSON.stringify(message)));
}

// const message = {
//   event: 'message/connection',
//   id: 123,
//   date: '21.03.2022',
//   username: 'user 1',
//   message: 'test message'
// }
