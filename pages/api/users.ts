import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import startOrm from "../../utils/initialize-database";
import { Template } from "../../entities/Template";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();
  const templates = await orm.em.find(Template, {});

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ templates }));
};
