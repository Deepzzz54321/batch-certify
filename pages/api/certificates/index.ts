import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import startOrm from "../../../utils/initialize-database";
import { Template } from "../../../entities/Template";
import { Certificate } from "../../../entities/Certificate";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();
  switch (req.method) {
    case "GET":
      const certificates = await orm.em.find(Certificate, {}, ["template"]);
      res.status(200).json({ certificates });
      break;
    case "POST":
      const { name, email, templateId } = req.body;
      try {
        if (!(name && email && templateId)) {
          throw new Error("Missing name or email or templateID.");
        }
        const template = await orm.em.findOneOrFail(Template, {
          id: templateId,
        });
        console.log({ template });
        const certificate = new Certificate(name, email, template);
        await orm.em.persistAndFlush(certificate);

        res.status(201).json({ certificate });
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
