import fastify, {FastifyReply, FastifyRequest} from 'fastify'
import multipart from '@fastify/multipart'
import {uploadRoute} from "./routes/upload";
import fs from "fs";
import {dataRoute} from "./routes/data";

const uploadsFolder = './uploads';
if (!fs.existsSync(uploadsFolder)){
    fs.mkdirSync(uploadsFolder, { recursive: true });
}

const server = fastify({ logger: true });
server.register(multipart);

uploadRoute(server);
dataRoute(server);

server.listen({ port: 3000, host: "localhost" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
})
