import http from "http";
import * as map from "lib0/map";
import internal from "stream";
import ws from "ws";

interface YSubscriptionMessage {
  type: "subscribe" | "unsubscribe";
  topics?: string[];
}
interface YPingMessage {
  type: "ping";
}
interface YPublishMessage {
  type: "publish";
  topic?: string;
  [k: string]: any;
}

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const wsReadyStateClosing = 2; // eslint-disable-line
const wsReadyStateClosed = 3; // eslint-disable-line

const pingTimeout = 30000;

const port = process.env.PORT || 4444;
const wss = new ws.Server({ noServer: true });

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

/**
 * Map froms topic-name to set of subscribed clients.
 */
const topics = new Map<string, Set<ws.WebSocket>>();

/**
 * @param socket
 * @param message
 */
const send = (socket: ws.WebSocket, message: object) => {
  if (
    socket.readyState !== wsReadyStateConnecting &&
    socket.readyState !== wsReadyStateOpen
  ) {
    socket.close();
  }
  try {
    socket.send(JSON.stringify(message));
  } catch (e) {
    socket.close();
  }
};

/**
 * Setup a new client
 * @param socket
 */
const onconnection = (socket: ws.WebSocket) => {
  const subscribedTopics = new Set<string>();
  let closed = false;
  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      socket.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        socket.ping();
      } catch (e) {
        socket.close();
      }
    }
  }, pingTimeout);
  socket.on("pong", () => {
    pongReceived = true;
  });
  socket.on("close", () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set();
      subs.delete(socket);
      if (subs.size === 0) {
        topics.delete(topicName);
      }
    });
    subscribedTopics.clear();
    closed = true;
  });

  socket.on("message", (data: ws.RawData) => {
    const yMessage: YPingMessage | YPublishMessage | YSubscriptionMessage =
      JSON.parse(data.toString());

    if (yMessage && yMessage.type && !closed) {
      switch (yMessage.type) {
        case "subscribe":
          (yMessage.topics || []).forEach((topicName) => {
            if (typeof topicName === "string") {
              // add conn to topic
              const topic = map.setIfUndefined(
                topics,
                topicName,
                () => new Set()
              );
              topic.add(socket);
              // add topic to conn
              subscribedTopics.add(topicName);
            }
          });
          break;
        case "unsubscribe":
          (yMessage.topics || []).forEach((topicName) => {
            const subs = topics.get(topicName);
            if (subs) {
              subs.delete(socket);
            }
          });
          break;
        case "publish":
          if (yMessage.topic) {
            const receivers = topics.get(yMessage.topic);
            if (receivers) {
              receivers.forEach((receiver) => send(receiver, yMessage));
            }
          }
          break;
        case "ping":
          send(socket, { type: "pong" });
      }
    }
  });
};
wss.on("connection", onconnection);

server.on(
  "upgrade",
  (request: http.IncomingMessage, socket: internal.Duplex, head: Buffer) => {
    // You may check auth of request here..
    /**
     * @param socket
     */
    const handleAuth = (authSocket: ws.WebSocket) => {
      wss.emit("connection", authSocket, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  }
);

server.listen(port);

console.log("Signaling server running on localhost:", port);
