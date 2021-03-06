import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import startOrm from "../../../utils/initialize-database";
import { Certificate } from "../../../entities/Certificate";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();
  const {
    query: { id },
  } = req;
  switch (req.method) {
    case "GET":
      const certificate = await orm.em.findOne(Certificate, { id });
      res.status(200).json({ certificate });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
