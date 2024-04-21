import fs from "fs";
import { parse } from "csv-parse";
import { server } from "../providers/server";
import { dataQuery, dataResponse, errorResponse } from "../schemas";

type getDataResponse = {
  tempData: Array<number>;
  humidityData: Array<number>;
  timestamps: Array<string>;
};

const getData = (
  deviceId: string,
  timelapseId: string,
  lines: number,
): Promise<getDataResponse> => {
  return new Promise((resolve, reject) => {
    const tempData: Array<number> = [];
    const humidityData: Array<number> = [];
    const timestamps: Array<string> = [];

    let result: getDataResponse = {
      tempData,
      humidityData,
      timestamps,
    };

    // will be in upload with corresponding deviceId and timelapseId
    fs.createReadStream(`./test_data/${deviceId}/data_${timelapseId}.csv`)
      .pipe(parse({ delimiter: ",", from_line: 2, to: lines }))
      .on("data", function (row) {
        tempData.push(Number(row[0]));
        humidityData.push(Number(row[1]));
        timestamps.push(row[2]);
      })
      .on("end", function () {
        console.log("finished");
        result = { tempData, humidityData, timestamps };
        resolve(result);
      })
      .on("error", function (error) {
        console.error(error.message);
        reject(error);
      });
  });
};

server.get(
  "/data",
  {
    schema: {
      querystring: dataQuery,
      response: {
        200: dataResponse,
        400: errorResponse,
      },
    },
  },
  async function (request, reply) {
    const { deviceId, timelapseId, lines } = request.query;

    if (!deviceId) {
      return reply
        .code(400)
        .send({ error: "deviceId query parameter is required" });
    }

    if (!timelapseId) {
      return reply
        .code(400)
        .send({ error: "timelapseId query parameter is required" });
    }

    if (!lines || lines < 1) {
      return reply.code(400).send({
        error: "lines query parameter is required and must be greater than 0",
      });
    }

    if (!fs.existsSync(`./test_data/${deviceId}/data_${timelapseId}.csv`)) {
      return reply.code(404).send({
        error: `file data_${timelapseId}.csv not found for the device ${deviceId}`,
      });
    }

    //TODO : if lines is greater than the number of lines in the file, error

    return await getData(deviceId, timelapseId, lines);
  },
);
