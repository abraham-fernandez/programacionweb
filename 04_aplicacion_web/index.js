const createServer = require("./create_server.js");
const fs = require('fs')

const get = (request, response) => {
  // ...📝

switch (request.path) {
  case "/":
    response.send(
        "200",
        {"Content-Type": "text/html",
          "Access-Control-Allow-Origin": "*"},
        fs.readFileSync('./index.html')
    );
    break;
  default:
    response.send(
        "200",
        {"Access-Control-Allow-Origin": "*"},
        fs.readFileSync('.'+request.path)
    );
}
};

const post = (request, response) => {
  // ...📝

  response.send(
    "200"
    // ...,
    // ...
  );
};

const requestListener = (request, response) => {
  switch (request.method) {
    case "GET": {
      return get(request, response);
    }
    case "POST": {
      return post(request, response);
    }
    default: {
      return response.send(
        404,
        { "Content-Type": "text/plain" },
        "The server only supports HTTP methods GET and POST"
      );
    }
  }
};

const server = createServer((request, response) => {
  try {
    return requestListener(request, response);
  } catch (error) {
    console.error(error);
    response.send(500, { "Content-Type": "text/plain" }, "Uncaught error");
  }
});

server.listen(8080);
