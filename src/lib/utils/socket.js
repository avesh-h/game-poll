import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

let socket;

const URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';

const connectToSocket = () => {
  if (!socket) {
    socket = io(URL);
  }
};

export { connectToSocket, socket };
