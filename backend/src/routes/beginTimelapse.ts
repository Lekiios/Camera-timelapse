import { access, constants, mkdir, writeFile } from "node:fs/promises";
import { server } from "../providers/server";
import {
  beginTimelapseQuery,
  errorResponse,
  messageResponse,
} from "../schemas";

server.post(
  "/begin-timelapse",
  {
    schema: {
      querystring: beginTimelapseQuery,
      response: {
        200: messageResponse,
        400: errorResponse,
      },
      tags: ["Timelapse"],
    },
  },
  async function (request, reply) {
    const { deviceId, timelapse } = request.query;

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

    const deviceDir = `./uploads/${deviceId}`;
    const timelapseDir = `${deviceDir}/${timelapse}`;

    try {
      await access(timelapseDir);
    } catch (err) {
      await mkdir(timelapseDir, { recursive: true });
    }

    const dataFile = `${deviceDir}/data_${timelapse}.csv`;
    try {
      await access(dataFile, constants.F_OK & constants.W_OK);
    } catch (error) {
      await writeFile(dataFile, "temp,humidity,timestamp\n");
    }

    return { message: `Timelapse ${timelapse} started` };
  },
);
