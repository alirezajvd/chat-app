const app = require('./middleware');
const http = require('http')
const WebSocket = require('ws')
const routes = require('./routes');
const {createUserTable, createMessageTable} = require('./db');

createUserTable();
createMessageTable();

const port = process.env.PORT || 8000;

const server = http.createServer(app);

const wss = new WebSocket.Server({server});


wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    // Send initial communication log data to client upon connection

    ws.on('message', async (message) => {
        console.log(`WebSocket Received message: ${message}`);

        try {
            const parsedMessage = JSON.parse(message);
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});


app.use('/', routes);


server.listen(port, () =>{
    console.log(`server is running oon http://localhost:${port}`);
});
