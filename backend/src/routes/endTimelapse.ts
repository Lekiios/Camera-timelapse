import { exec } from "node:child_process";
import { access, cp, mkdir } from "node:fs/promises";
import { server } from "../providers/server";
import { endTimelapseQuery, errorResponse, messageResponse } from "../schemas";

server.post(
  "/end-timelapse",
  {
    schema: {
      querystring: endTimelapseQuery,
      response: {
        200: messageResponse,
        400: errorResponse,
        500: errorResponse,
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
        .send({ error: "timelapse query parameter is required" });
    }

    const deviceUploadDir = `./uploads/${deviceId}`;
    const timelapseUploadDir = `${deviceUploadDir}/${timelapse}`;

    try {
      await access(timelapseUploadDir);
    } catch (error) {
      return reply
        .code(400)
        .send({ error: `Timelapse ${timelapse} does not exist` });
    }

    const deviceOutputDir = `./data/${deviceId}`;
    const outputDir = `${deviceOutputDir}/timelapses`;
    try {
      await access(outputDir);
    } catch (error) {
      await mkdir(outputDir, { recursive: true });
    }

    const dataFile = `${deviceUploadDir}/data_${timelapse}.csv`;

    try {
      await access(dataFile);
    } catch (error) {
      return reply.code(500).send({ error: "Error accessing data file" });
    }

    const dataOutputFile = `${deviceOutputDir}/data_${timelapse}.csv`;
    try {
      await cp(dataFile, dataOutputFile);
    } catch (error) {
      return reply
        .code(500)
        .send({ error: `Error copying data for timelapse ${timelapse}` });
    }

    // TODO: Make input framerate higher
    const COMMAND = `ffmpeg -framerate 1 -i ${timelapseUploadDir}/%d.jpg -c:v libx264 -r 24  -pix_fmt yuv420p ${outputDir}/${timelapse}.mp4`;
    try {
      exec(COMMAND, (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
      });
    } catch (error) {
      return reply.code(500).send({ error: "Error creating timelapse" });
    }
    return { message: "Timelapse ended" };
  },
);
