import { Template } from "./entities/Template";
import { Options } from "@mikro-orm/core";
import { __dev__ } from "./utils/constants";
import dotenv from "dotenv";

dotenv.config();

const config: Options = {
  entities: [Template],
  dbName: "certificate-generator-db",
  type: "mongo",
  clientUrl: process.env.MONGO_CLIENT_URL,
  debug: __dev__,
};

export default config;
