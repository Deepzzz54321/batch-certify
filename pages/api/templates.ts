import { NextApiRequest, NextApiResponse } from "next";
import "reflect-metadata";
import startOrm from "../../utils/initialize-database";
import { Template } from "../../entities/Template";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();

  const template = new Template(
    "my template",
    "https://i.pinimg.com/originals/07/af/ff/07afffb321f3a2977becbbf3cda0b7a2.png"
  );

  await orm.em.persistAndFlush(template);
  res.statusCode = 201;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ template }));
};
