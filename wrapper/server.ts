import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket/lib/websocket.ts";

import {
  Associate,
  Connection,
  Read,
  Release,
  isAssociate,
  isRead,
  isRelease,
} from "./foundation/eventtypes.ts";
import { associate, release, connDestroy } from "./mmsConnect.ts";
import { readValue } from "./readValue.ts";

// Manage already connected IED
const connections: Map<string, Deno.PointerValue> = new Map();
let ws: WebSocketClient;

function mmsAssociate(msg: Associate): void {
  const id = `${msg.conn.host}:${msg.conn.port}`;

  if (connections.has(id)) ws.send(`IED ${id} already associated!`);
  else {
    ws.send(`Associate to ${id}`);
    const { conn, error } = associate(msg.conn.host, msg.conn.port);

    if (!error.is) connections.set(id, conn);

    ws.send(error.error_msg);
  }
}

function mmsRelease(msg: Release): void {
  const id = `${msg.conn.host}:${msg.conn.port}`;

  if (connections.has(id)) {
    const conn = connections.get(id);
    release(conn);
    ws.send(JSON.stringify({ type: "log", msg: `IED ${id} released!` }));

    connections.delete(id);
  } else ws.send("Unknown Connection!");
}

function mmsRead(msg: Read): void {
  console.log(msg);
  const id = `${msg.conn.host}:${msg.conn.port}`;

  if (!connections.has(id)) mmsAssociate({ type: "associate", conn: msg.conn });

  if (connections.has(id)) {
    const conn = connections.get(id);

    const vals = msg.vals;
    for (const val of vals) {
      const result = readValue(conn, val.ref, val.fc, val.bType);
      console.log(result);
      ws.send(JSON.stringify({ type: "result", result }));
    }
  } else ws.send("Cannot read from IED");
}

const wss = new WebSocketServer();
wss.on("connection", (webS: WebSocketClient) => {
  console.log("socket connected!");
  ws = webS; // Save global socket

  ws.on("message", (payload: string) => {
    const msg = JSON.parse(payload);

    if (isAssociate(msg)) mmsAssociate(msg);
    else if (isRelease(msg)) mmsRelease(msg);
    else if (isRead(msg)) mmsRead(msg);
  });
});
