import { config } from "./src/config/config.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";

const BACKEND_PORT = config.BACKEND_PORT || 3000;

const StartServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(BACKEND_PORT, () => {
      console.log(`Server is running on port ${BACKEND_PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

StartServer();
