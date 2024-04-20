import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fs from "fs";
import {parse} from "csv-parse";


const getData = (deviceId: string, timelapseId: string, lines: number): Promise<{tempData: Array<number>, humidityData: Array<number>}> => {
    return new Promise((resolve, reject) => {
        const tempData: Array<number> = [];
        const humidityData: Array<number> = [];

        let result : {tempData: Array<number>, humidityData: Array<number>} = {tempData, humidityData};

        // will be in upload with corresponding deviceId and timelapseId
        fs.createReadStream(`./test_data/${deviceId}/data_${timelapseId}.csv`)
            .pipe(parse({ delimiter: ",", from_line: 2, to: lines }))
            .on("data", function (row) {
                tempData.push(Number(row[0]));
                humidityData.push(Number(row[1]));
            })
            .on("end", function () {
                console.log("finished");
                result = {tempData, humidityData};
                resolve(result);
            })
            .on("error", function (error) {
                console.error(error.message);
                reject(error);
            });
    })

}

type UploadFileReq = FastifyRequest<{
    Querystring: { deviceId: string, timelapseId: string, lines: number }
}>

export const dataRoute = (server: FastifyInstance) => {
    server.get('/data', async function (request: UploadFileReq, reply: FastifyReply) {

        const {deviceId, timelapseId,  lines} = request.query;

        if(!deviceId) {
            return reply.code(400).send({error: "deviceId query parameter is required"})
        }

        if(!timelapseId) {
            return reply.code(400).send({error: "timelapseId query parameter is required"})
        }

        if (!lines || lines < 1) {
            return reply.code(400).send({error: "lines query parameter is required and must be greater than 0"})
        }

        if (!fs.existsSync(`./test_data/${deviceId}/data_${timelapseId}.csv`)) {
            return reply.code(404).send({error: `file data_${timelapseId}.csv not found for the device ${deviceId}`})
        }

        //TODO : if lines is greater than the number of lines in the file, error

        return await getData(deviceId, timelapseId, lines);
    });

}

