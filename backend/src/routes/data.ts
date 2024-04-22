import { parse } from "csv-parse";
import { createReadStream } from "node:fs";
import {
  access,
  appendFile,
  constants,
  mkdir,
  writeFile,
} from "node:fs/promises";
import { server } from "../providers/server";
import {
  dataQuery,
  dataResponse,
  errorResponse,
  messageResponse,
  postDataBody,
  postDataQuery,
} from "../schemas";

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
    createReadStream(`./data/${deviceId}/data_${timelapseId}.csv`)
      .pipe(
        parse({
          delimiter: ",",
          from_line: 2,
          // if lines is -1, read all lines
          to: lines === -1 ? undefined : lines,
        }),
      )
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

// GET /data
server.get(
  "/data",
  {
    schema: {
      querystring: dataQuery,
      response: {
        200: dataResponse,
        400: errorResponse,
      },
      tags: ["Data"],
    },
  },
  async function (request, reply) {
    const { deviceId, timelapse, lines } = request.query;

    if (!deviceId) {
      return reply
        .code(400)
        .send({ error: "deviceId query parameter is required" });
    }

    if (!timelapse) {
      return reply
        .code(400)
        .send({ error: "timelapseId query parameter is required" });
    }

    if (lines && lines < 1) {
      return reply.code(400).send({
        error: "lines query parameter must be greater than 0",
      });
    }

    try {
      await access(
        `./data/${deviceId}/data_${timelapse}.csv`,
        constants.F_OK & constants.R_OK,
      );
    } catch (error) {
      return reply.code(404).send({
        error: `file data_${timelapse}.csv not found for the device ${deviceId}`,
      });
    }

    if (!lines) {
      return await getData(deviceId, timelapse, -1);
    }

    return await getData(deviceId, timelapse, lines);
  },
);

// POST /data
server.post(
  "/data",
  {
    schema: {
      querystring: postDataQuery,
      body: postDataBody,
      response: {
        200: messageResponse,
        400: errorResponse,
      },
      tags: ["Data"],
    },
  },
  async function (request, reply) {
    const { deviceId, timelapse } = request.query;
    const { temp, humidity, timestamp } = request.body;

    if (!deviceId) {
      return reply
        .code(400)
        .send({ error: "deviceId query parameter is required" });
    }

    if (!timelapse) {
      return reply
        .code(400)
        .send({ error: "timelapseId query parameter is required" });
    }

    if (!temp) {
      return reply.code(400).send({ error: "temp body parameter is required" });
    }

    if (!humidity) {
      return reply
        .code(400)
        .send({ error: "humidity body parameter is required" });
    }

    if (!timestamp) {
      return reply
        .code(400)
        .send({ error: "timestamp body parameter is required" });
    }

    try {
      await access(`./uploads/${deviceId}`);
    } catch (error) {
      await mkdir(`./uploads/${deviceId}`);
    }

    const file = `./uploads/${deviceId}/data_${timelapse}.csv`;
    try {
      await access(file, constants.F_OK & constants.W_OK);
    } catch (error) {
      await writeFile(file, "temp,humidity,timestamp\n");
    }

    await appendFile(file, `${temp},${humidity},${timestamp}\n`);

    return { message: "Data added successfully" };
  },
);
