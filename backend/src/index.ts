import fs from "fs";
import { configurePlugins, server } from "./providers/server";

const { SERVER_PORT = 3000, SERVER_HOST = "localhost" } = process.env;

const main = async () => {
  try {
    // Create uploads folder if it doesn't exist before starting the server
    const uploadsFolder = "./uploads";
    if (!fs.existsSync(uploadsFolder)) {
      fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    await configurePlugins();

    await Promise.all([
      await import("./routes/data"),
      await import("./routes/timelapses"),
      await import("./routes/timelapse"),
      await import("./routes/uploadImage"),
    ]);

    await server.listen({
      port: Number(SERVER_PORT),
      host: SERVER_HOST,
    });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

main().catch(console.error);
