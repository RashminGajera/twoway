interface Env {
  ROOM: DurableObjectNamespace;
}

export class Room {
  constructor(private readonly state: DurableObjectState) {}

  fetch(request: Request): Response {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("WebSocket upgrade required", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair) as [WebSocket, WebSocket];
    this.state.acceptWebSocket(server);
    const sockets = this.state.getWebSockets();
    if (sockets.length === 2) {
      for (const socket of sockets) socket.send(JSON.stringify({ type: "peer-ready" }));
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(socket: WebSocket, message: string | ArrayBuffer): void {
    for (const other of this.state.getWebSockets()) {
      if (other !== socket) other.send(message);
    }
  }

  webSocketClose(socket: WebSocket): void {
    socket.close();
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("TwoWay signaling server is running.", { status: 200 });
    }
    const match = url.pathname.match(/^\/room\/([a-zA-Z0-9]{6,32})$/);
    if (!match) return new Response("Room not found", { status: 404 });

    const room = env.ROOM.idFromName(match[1]);
    return env.ROOM.get(room).fetch(request);
  }
};
