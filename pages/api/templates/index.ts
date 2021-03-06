import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import startOrm from "../../../utils/initialize-database";
import { Template } from "../../../entities/Template";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();
  switch (req.method) {
    case "GET":
      const templates = await orm.em.find(Template, {});
      res.status(200).json({ templates });
      break;
    case "POST":
      const { name, imageURL } = req.body;
      try {
        if (!(name && imageURL)) {
          throw new Error("Missing name and image URL.");
        }
        const template = new Template(name, imageURL);
        await orm.em.persistAndFlush(template);

        res.status(201).json({ template });
      } catch (error) {
        console.log("Catched Error:  ", error);
        res.status(400).json({ error: error.message });
      }

      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
