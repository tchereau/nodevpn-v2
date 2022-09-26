import { Tun, Tap} from 'tuntap2';
import { WebSocketServer } from 'ws';
import {config} from 'dotenv';
import https from 'https';
import fs from 'fs';
config();

let webserver = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: process.env.PASSPHRASE,
}, (req, res) => {
  res.writeHead(200);
  res.end('hello world')
}).listen(443);

const tap = new Tap();

try{

    tap.mtu = 1400;
    tap.ipv4 = "10.11.12.1/24";
    tap.isUp = true;
    console.log(`created tap: ${tap.name}, ip: ${tap.ipv4}, mtu: ${tap.mtu}`);
}catch(e){
    console.log(`error: ${e}`);
    process.exit(0);
}

var wss = new WebSocketServer({server: webserver});
wss.on('connection', function(c) {
    console.log('client connected');
    if(tap) {
        tap.on('data', (buf) => {
            //console.log(`sent: ${buf}`);
            c.send(buf);
        }
        );
        c.on('message', (buf) => {
            //console.log(`received: ${buf}`);
            tap.write(buf);
        }
        );
    }
});
wss.on('error', function(e) {
    console.log(`error: ${e}`);
    process.exit(0);
}
);