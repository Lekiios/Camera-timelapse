import fs from "fs";
import { server } from "../providers/server";
import { errorResponse, timelapsesQuery, timelapsesResponse } from "../schemas";

server.get(
  "/timelapses",
  {
    schema: {
      querystring: timelapsesQuery,
      response: {
        200: timelapsesResponse,
        400: errorResponse,
      },
      tags: ["Timelapse"],
    },
  },
  async function (request, reply) {
    const { deviceId } = request.query;

    if (!deviceId) {
      return reply
        .code(400)
        .send({ error: "deviceId query parameter is required" });
    }

    const timelapsesFolder = `./data/${deviceId}/timelapses`;
    if (!fs.existsSync(timelapsesFolder)) {
      return reply
        .code(404)
        .send({ error: `No timelapse for device : ${deviceId} ` });
    }
    const fileList = fs.readdirSync(timelapsesFolder);

    return { timelapses: fileList };
  },
);
