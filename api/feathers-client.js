import feathers from '@feathersjs/feathers';
import auth from '@feathersjs/authentication-client';
import socketio from '@feathersjs/socketio-client';
import { CookieStorage } from 'cookie-storage';
import io from 'socket.io-client';

const socket = io('http://localhost:3030');
const api = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: new CookieStorage() }));

export default api;