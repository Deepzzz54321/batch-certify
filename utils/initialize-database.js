import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import config from "../mikro-orm.config";

const startOrm = async () => MikroORM.init(config);

export default startOrm;
