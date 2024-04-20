import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fs from "fs";
import {parse} from "csv-parse";


type UploadFileReq = FastifyRequest<{
    Querystring: { deviceId: string }
}>

export const timelapsesRoute = (server: FastifyInstance) => {
    server.get('/timelapses', async function (request: UploadFileReq, reply: FastifyReply) {

        const {deviceId} = request.query;

        if(!deviceId) {
            return reply.code(400).send({error: "deviceId query parameter is required"})
        }

        const timelapsesFolder = `./test_data/${deviceId}/timelapses`
        if (!fs.existsSync(timelapsesFolder)) {
            return reply.code(404).send({error: `No timelapse for device : ${deviceId} `})
        }
        const fileList = fs.readdirSync(timelapsesFolder)


        return {timelapses: fileList}
    });

}

