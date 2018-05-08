const path = require("path");
const favicon = require("serve-favicon");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("winston");

const feathers = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");

const middleware = require("./middleware");
const services = require("./services");
const appHooks = require("./app.hooks");
const channels = require("./channels");

const authentication = require("./authentication");

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
// app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

const parties = app.service("parties");
const coups = app.service("coups");

coups.on("created", coup => {
  if (!coup.succ) {
    parties.get(coup.partieId).then(partie => {
      let newCourant = partie.joueurCourant == 0 ? 1 : 0;
      parties.patch(coup.partieId, { joueurCourant: newCourant });
    });
  }
});

module.exports = app;
