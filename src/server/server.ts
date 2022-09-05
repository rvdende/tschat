import express from 'express'
import morgan from 'morgan';
import * as http from "http";
import path from 'path';
import { WebSocketServer, WebSocket as WSWebSocket } from "ws";
import * as packageJson from '../../package.json'
import { IChat, IEvent } from '../shared'
import { v4 as uuidv4 } from 'uuid';
import { MongoClient } from "mongodb"

// let history: IEvent<any>[] = [];

export const startServer = async () => {
    console.log(`Starting ${packageJson.name} ${packageJson.version}`)

    const client = new MongoClient(process.env.MONGODB_URI || "mongodb://192.168.1.243")
    const mongodb = client.db(process.env.MONGODB_DATABASE || 'tschat');
    let ws: WebSocketServer;

    const db = {
        events: mongodb.collection<IEvent<any>>("events")
    }

    console.log(process.env);

    const app = express();
    app.use(morgan('dev'));
    app.use(express.json());
    let staticFolder = path.join(__dirname, '../../../build');
    console.log("StaticFolder:", staticFolder);
    app.use(express.static(staticFolder));

    app.get('/api/chat/history', async (req,res) => {
        let events = await db.events.find({}).toArray();
        res.json(events);
    })

    app.get('/*', (req, res) => {
        res.sendFile(staticFolder + '/index.html');
    })

    const server = http.createServer(app);
    server.listen(8080, () => {
        console.log(`API server listening on port: ${8080}`)
    })

    let wsserver = new WSWebSocket.Server({ noServer: true });

    wsserver.on('connection', (socket, req) => {
        console.log(`websocket connected ${req.url}`);

        socket.on('message', async (data) => {
            try {
                let payload = JSON.parse(data.toString());

                let chatmessage: IChat = payload;
                if (!chatmessage.message) throw new Error('missing message from data')
                if (!chatmessage.username) throw new Error('missing username from data');

                console.log(`ws message ${req.url}`)
                console.log(payload);

                let event: IEvent<IChat> = {
                    id: uuidv4(),
                    type: 'chatmessage',
                    timestamp: new Date(),
                    data: chatmessage
                }

                await db.events.insertOne(event);

                wsserver.clients.forEach(c => {
                    if (!c.OPEN) return;
                    c.send(JSON.stringify(event));
                })
                // socket.send(JSON.stringify({ "type": "payload", "origin_id": "websocket:3", payload }))
            } catch (err) {
                console.log(`socket message error ${err}`)
            }
        })
    })

    server.on('upgrade', (req, socket, head) => {
        if (req.url === "/ws") return; // ignore /ws calls its from the local create-react-app dev server
        console.log(req.url);
        wsserver.handleUpgrade(req, socket, head, (ws) => {
            wsserver.emit("connection", ws, req);
        })
    })

}

startServer();

