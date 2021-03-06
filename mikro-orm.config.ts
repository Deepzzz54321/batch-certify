import { Template } from "./entities/Template";
import { Options } from "@mikro-orm/core";
import { __dev__ } from "./utils/constants";
import dotenv from "dotenv";
import { Certificate } from "./entities/Certificate";

dotenv.config();

const config: Options = {
  entities: [Template, Certificate],
  dbName: "certificate-generator-db",
  type: "mongo",
  clientUrl: process.env.MONGO_CLIENT_URL,
  debug: __dev__,
};

export default config;
