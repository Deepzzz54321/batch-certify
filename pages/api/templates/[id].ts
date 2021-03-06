import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import startOrm from "../../../utils/initialize-database";
import { Template } from "../../../entities/Template";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();
  const {
    query: { id },
  } = req;
  switch (req.method) {
    case "GET":
      const template = await orm.em.findOne(Template, { id });
      res.status(200).json({ template });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
