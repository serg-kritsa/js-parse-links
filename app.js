"use strict";

const Path = require("path");
const Hapi = require("@hapi/hapi");
const Hoek = require("@hapi/hoek");
const routes = require("./routes");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost"
  });
  await server.register(require("@hapi/vision"));
  server.views({
    engines: {
      html: require("handlebars")
    },
    relativeTo: __dirname,
    path: "templates"
    // isCached: false, // for developing
  });

  server.route(routes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();