const net = require("net");

const objectsToLines = (obj) => {
    return Object.entries(obj).map(pair => `${pair[0]}:${pair[1]}`).join('\r\n');
}

const request = (method, path, protocol, headers, body, header) => {
    return {
        method,
        path,
        protocol,
        headers,
        body,
        getHeader: (header) => {
            const lowercased = Object.entries(headers).reduce((a, [key, value]) => {
                a[key.toLowerCase()] = value;
                return a;
            }, {});

            if(lowercased[header.toLowerCase()])
                return lowercased[header.toLowerCase()].trim()
            return null


        }
    }
}
const codeToReason=(code)=> {
    const reasons = {
        '200': 'OK',
        '404': 'Not Found',
        '500': 'Server Error'
    }
    return reasons[code];
}

const createServer = (requestHandler) => {

    let buffer = [];
    let body = [];
    let headers = [];
    let contentLength = [];
    const server = net.createServer(socket => {
        console.log("client connected");
        //function send del response
        const response = () => {
            return {
                send: (statusCode, headers, body) => {
                    headers['Date'] = (new Date()).toUTCString()
                    headers['Content-Lengtth'] = body.length
                    socket.write(`HTTP/1.1 ${statusCode} ${codeToReason(statusCode)}\r\n`);
                    socket.write(`${objectsToLines(headers)}\r\n`);
                    socket.write("\r\n");
                    socket.write(body);
                    socket.end();
                }
            }
        }

        socket.on("data", (data) => {

            buffer = data.toString("utf8").split("\r\n");
            //Obtener el método, el path y el protocolo de la petición
            const method = buffer[0].split(" ")[0]
            const path = buffer[0].split(" ")[1]
            const protocol = buffer[0].split(" ")[2]

            //Comprobar cabeceras
            if (buffer[1] === "")
                return

            //Obtener el Content Length
            if (buffer.join().toLowerCase().match("[abc]*content-length: \\d+[abc]*")) {
                const contentLength = buffer.join().toLowerCase().match("[abc]*content-length: \\d+[abc]*")[0].split(" ");
            }
            const flag = (buffer.indexOf(''))
            //Obtener el body de la petición
            buffer.forEach((element, indice, array) => {
                if (indice > flag)
                    body += element
                if (indice > 0 && indice < flag)
                    headers[element.split(':')[0]] = element.split(':')[1];
            });
            //Comprobar si hemos recogido el body completo
            if (!body.length === contentLength[1])
                return
            //console.log(buffer.includes('')); //true all headers
            requestHandler(request(method, path, protocol, headers, body, ''), response())

        });
        socket.on("end", () => {
            console.log("Client disconnected");
        });

    });

    return {
        listen: (portNumber) => {
            server.listen(portNumber, () => {
                console.log("Listening to port: " + portNumber);
            });
        },
        close:()=>{
            server.close();
        }

    };
};

module.exports = createServer;
