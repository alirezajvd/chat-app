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
//----------------------
////////////IMPORTANT:::::Have to change the wesbsocket so that it only sends the messages between user and recipient////////
//-----------------------
// const userSocketMap = new Map();

// wss.on('connection', (ws) => {
//     console.log('WebSocket client connected');

//     ws.on('message', (message) => {
//         console.log(`WebSocket Received message: ${message}`);

//         try {
//             const parsedMessage = JSON.parse(message);
//             const userId = parsedMessage.userId;
//             const recipientId = parsedMessage.recipientId;

//             userSocketMap.set(userId, ws)

//             const recipientSocket = userSocketMap.get(recipientId);
//             const senderSocket = userSocketMap.get(userId);
//             //console.log(recipientSocket);
//             //console.log(senderSocket);
//             console.log(senderSocket === true, senderSocket !== ws);

//             if (recipientSocket && recipientSocket !== ws && recipientSocket.readyState === WebSocket.OPEN) {
//                 recipientSocket.send(JSON.stringify(parsedMessage));
//                 console.log('im in sender');
//             }

//             if (senderSocket && senderSocket !== ws && senderSocket.readyState === WebSocket.OPEN) {
//                 senderSocket.send(JSON.stringify(parsedMessage));
//                 console.log('im in user');
//             }

//         } catch (error) {
//             console.error('Error parsing message:', error);
//         }
//     });

//     ws.on('close', () => {
//         console.log('WebSocket client disconnected');

//         userSocketMap.forEach((socket, key) => {
//             if (socket === ws) {
//                 userSocketMap.delete(key);
//             }
//         });
//     });
// });

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
