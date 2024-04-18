import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fs from "fs";
import { pipeline } from 'stream'
import util from "util";

const pump = util.promisify(pipeline)

type UploadFileReq = FastifyRequest<{
    Querystring: { deviceId: string, timelapseId: string }
}>

export const uploadRoute = (server: FastifyInstance) => {
    server.post('/upload', async function (request: UploadFileReq, reply: FastifyReply) {

        const {deviceId, timelapseId} = request.query ;
        const timelapseFolder = `./uploads/${deviceId}/${timelapseId}`;

        if (!fs.existsSync(timelapseFolder)){
            fs.mkdirSync(timelapseFolder, { recursive: true });
        }

        const parts = request.parts();

        for await (const part of parts as any) {
            await pump(part.file, fs.createWriteStream(`${timelapseFolder}/${part.filename}`))

        }
        // The rest of your code
        return {message : 'files uploaded' }
    });

}

