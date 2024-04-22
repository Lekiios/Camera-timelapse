import fs from "fs";
import { pipeline } from "stream";
import util from "util";
import { server } from "../providers/server";
import { messageResponse, uploadImageQuery } from "../schemas";

const pump = util.promisify(pipeline);

server.post(
  "/uploadImage",
  {
    schema: {
      querystring: uploadImageQuery,
      consumes: ["multipart/form-data"],
      /*body: {
        type: "object",
        required: ["file"],
        properties: {
          file: { isFile: true },
        },
      },*/
      response: {
        200: messageResponse,
      },
    },
  },
  async function (request) {
    const { deviceId, timelapse } = request.query;
    const timelapseFolder = `./uploads/${deviceId}/${timelapse}`;

    if (!fs.existsSync(timelapseFolder)) {
      fs.mkdirSync(timelapseFolder, { recursive: true });
    }

    const data = await request.file();
    console.log(data);
    if (data) {
      await pump(
        data.file,
        fs.createWriteStream(`${timelapseFolder}/${data.filename}`),
      );
    }

    /*const parts = request.parts();

    for await (const part of parts as any) {
      await pump(
        part.file,
        fs.createWriteStream(`${timelapseFolder}/${part.filename}`),
      );
    }*/
    // The rest of your code
    return { message: "files uploaded" };
  },
);
