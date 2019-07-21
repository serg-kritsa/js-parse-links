const routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      let q = "";
      return h.view("index", { test: q });
    }
  },
  {
    method: "*",
    path: "/{any*}",
    handler: function(request, h) {
      return "404 Error! Page Not Found!";
    }
  }
];
module.exports = routes;
