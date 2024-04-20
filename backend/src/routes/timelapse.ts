import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fs from "fs";
import {parse} from "csv-parse";
import * as repl from "node:repl";


type UploadFileReq = FastifyRequest<{
    Querystring: { deviceId: string, timelapse: string }
}>

export const timelapseRoute = (server: FastifyInstance) => {
    server.get('/timelapse', async function (request: UploadFileReq, reply: FastifyReply) {

        const {deviceId, timelapse} = request.query;

        if(!deviceId) {
            return reply.code(400).send({error: "deviceId query parameter is required"})
        }

        if(!timelapse) {
            return reply.code(400).send({error: "timelapse query parameter is required"})
        }

        const timelapseFile = `./test_data/${deviceId}/timelapses/${timelapse}`
        if (!fs.existsSync(timelapseFile)) {
            return reply.code(404).send({error: `No timelapse ${timelapse} for device : ${deviceId} `})
        }

        const stream = fs.createReadStream(timelapseFile)
        reply.header('Content-Type', 'application/octet-stream')

        return reply.send(stream)
    });

}

