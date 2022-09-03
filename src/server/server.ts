import express from 'express'
import morgan from 'morgan';
import * as http from "http";
import path from 'path';
import { WebSocketServer, WebSocket as WSWebSocket } from "ws";
import * as packageJson from '../../package.json'
import { IChat, IEvent } from '../shared'
import { v4 as uuidv4 } from 'uuid';

let history: IEvent<any>[] = [];

export const startServer = async () => {
    console.log(`Starting ${packageJson.name} ${packageJson.version}`)
    let ws: WebSocketServer;

    const app = express();
    app.use(morgan('dev'));
    app.use(express.json());
    let staticFolder = path.join(__dirname, '../../../build');
    console.log("StaticFolder:", staticFolder);
    app.use(express.static(staticFolder));

    // app.get('/rest/features', async (req, res) => {
    //     res.json({
    //         project: true,
    //         security: true,
    //         mqtt: true,
    //         ntp: true,
    //         ota: true,
    //         upload_firmware: true
    //     })
    // })

    // app.post('/rest/signIn', async (req, res) => {
    //     if (req.body.username === "admin" && req.body.password === "admin") {
    //         res.json({
    //             access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWV9.J58xQU1cNwjC2X1oqWqqAFMGT0kByyoLpjt0mFppNvI"
    //         });
    //         return;
    //     }

    //     res.statusCode = 401;
    //     res.send();
    // })

    // app.get('/rest/verifyAuthorization', async (req, res) => {
    //     res.statusCode = 200;
    //     res.send();
    // })

    // app.get('/rest/wifiStatus', async (req, res) => {
    //     res.json({
    //         "status": 3,
    //         "local_ip": "192.168.1.130",
    //         "mac_address": "84:0D:8E:03:7F:04",
    //         "rssi": -59,
    //         "ssid": "bitlab",
    //         "bssid": "E4:C3:2A:28:C7:9F",
    //         "channel": 10,
    //         "subnet_mask": "255.255.255.0",
    //         "gateway_ip": "192.168.1.1",
    //         "dns_ip_1": "192.168.1.1"
    //     })
    // })

    // app.get('/rest/scanNetworks', async (req, res) => {
    //     setTimeout(() => {
    //         res.statusCode = 202;
    //         res.send()
    //     }, 500)
    // })

    // app.get('/rest/listNetworks', async (req, res) => {
    //     res.json({
    //         "networks": [
    //             {
    //                 "rssi": -56, "ssid": "disabled", "bssid": "E0:F4:42:25:DC:20",
    //                 "channel": 5, "encryption_type": 3
    //             }, {
    //                 "rssi": -60, "ssid": "bitlab", "bssid": "E4:C3:2A:28:C7:9F",
    //                 "channel": 10, "encryption_type": 3
    //             }, {
    //                 "rssi": -71, "ssid": "LoggerV-SLV213643303", "bssid": "BE:27:EB:85:7B:72",
    //                 "channel": 11, "encryption_type": 3
    //             },
    //             {
    //                 "rssi": -73, "ssid": "venus-HQ2030PRREM-94e", "bssid": "AE:64:CF:91:77:51",
    //                 "channel": 1, "encryption_type": 3
    //             }]
    //     })
    // })

    // app.get('/rest/wifiSettings', async (req, res) => {
    //     res.json({
    //         "ssid": "bitlab",
    //         "password": "placeholder",
    //         "hostname": "Talondevesp32",
    //         "static_ip_config": false
    //     })
    // })

    // app.get('/rest/apStatus', async (req, res) => {
    //     res.json({ "status": 1, "ip_address": "192.168.4.1", "mac_address": "84:0D:8E:03:7F:05", "station_num": 0 })
    // })

    // app.get('/rest/apSettings', async (req, res) => {
    //     res.json({
    //         provision_mode: 1,
    //         ssid: "Talon-840d8e037f04",
    //         password: "password",
    //         channel: 1,
    //         ssid_hidden: false,
    //         max_clients: 4,
    //         local_ip: "192.168.4.1",
    //         gateway_ip: "192.168.4.1",
    //         subnet_mask: "255.255.255.0"
    //     })
    // })

    // app.get('/rest/ntpStatus', async (req, res) => {
    //     res.json({
    //         "status": 1,
    //         "utc_time": new Date().toISOString(),
    //         "local_time": toIsoString(new Date()),
    //         "server": "time.google.com",
    //         "uptime": 970
    //     })
    // })

    // app.get('/rest/ntpSettings', async (req, res) => {
    //     res.json({
    //         "enabled": true, "server": "time.google.com",
    //         "tz_label": "Europe/London", "tz_format": "GMT0BST,M3.5.0/1,M10.5.0"
    //     })
    // })

    // app.get('/rest/mqttStatus', async (req, res) => {
    //     res.json({
    //         "enabled": false,
    //         "connected": false,
    //         "client_id": "esp32-47f038e0d84",
    //         "disconnect_reason": 0
    //     })
    // })

    // app.get('/rest/mqttSettings', async (req, res) => {
    //     res.json({
    //         enabled: false,
    //         host: "test.mosquitto.org",
    //         port: 1883,
    //         username: "",
    //         password: "",
    //         client_id: "esp32-840d8e037f04",
    //         keep_alive: 60,
    //         clean_session: true,
    //         max_topic_length: 128
    //     })
    // })

    // app.get('/rest/securitySettings', async (req, res) => {
    //     res.json({
    //         "jwt_secret": "3c7a8144-6d0e2f5c",
    //         "users": [
    //             { "username": "admin", "password": "admin", "admin": true },
    //             { "username": "guest", "password": "guest", "admin": false }]
    //     })
    // })

    // app.get('/rest/brokerSettings', async (req, res) => {
    //     res.json({"mqtt_path":"homeassistant/light/840d8e037f04","name":"light-840d8e037f04","unique_id":"light-840d8e037f04"})
    // })

    // app.get('/rest/systemStatus', async (req, res) => {
    //     res.json({
    //         esp_platform: "esp32",
    //         max_alloc_heap: 110580,
    //         psram_size: 0,
    //         free_psram: 0,
    //         cpu_freq_mhz: 240,
    //         free_heap: 182000,
    //         sketch_size: 1290368,
    //         free_sketch_space: 1310720,
    //         sdk_version: "v4.4.1-472-gc9140caf8c",
    //         flash_chip_size: 4194304,
    //         flash_chip_speed: 40000000,
    //         fs_total: 1507328,
    //         fs_used: 16384
    //     })
    // })

    // app.get('/rest/otaSettings', async (req, res) => {
    //     res.json({
    //         "enabled": true,
    //         "port": 8266,
    //         "password": "updatepassword"
    //     })
    // })



    app.get('/api/chat/history', (req,res) => {
        res.json(history);
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

        // if (req.url?.startsWith('/ws/lightState')) {
        //     socket.send(JSON.stringify({ "type": "id", "id": "websocket:1" }));
        //     socket.send(JSON.stringify({ "type": "payload", "origin_id": "websocket", "payload": { "led_on": false } }))
        // }

        socket.on('message', (data) => {
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

                history.push(event);

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

