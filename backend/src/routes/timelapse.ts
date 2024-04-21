import fs from "fs";
import { server } from "../providers/server";
import { timelapseQuery } from "../schemas";

server.get(
  "/timelapse",
  {
    schema: {
      querystring: timelapseQuery,
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
        .send({ error: "timelapse query parameter is required" });
    }

    const timelapseFile = `./test_data/${deviceId}/timelapses/${timelapse}`;
    if (!fs.existsSync(timelapseFile)) {
      return reply.code(404).send({
        error: `No timelapse ${timelapse} for device : ${deviceId} `,
      });
    }

    const stream = fs.createReadStream(timelapseFile);
    reply.header("Content-Type", "application/octet-stream");

    return reply.send(stream);
  },
);
