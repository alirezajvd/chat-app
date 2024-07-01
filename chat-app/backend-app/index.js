const app = require('./middleware');
const http = require('http')
const WebSocket = require('ws')
const routes = require('./routes');
const {createUserTable, createMessageTable} = require('./db');
const { error } = require('console');

createUserTable();
createMessageTable();

const port = process.env.PORT || 8000;

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    console.log('websocket client connected');
    ////need to add verify token
    ws.on('message', async (message) => {
        console.log(`websocket Received message: ${message} and type ${message.type}`);

        try {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage);
            if (parsedMessage.type === 'message') {

                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
            }
            else if (message.type === 'recipient') {
                console.log('im in recipient');
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
        

        
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    })
});

app.use('/', routes);


server.listen(port, () =>{
    console.log(`server is running oon http://localhost:${port}`);
});
