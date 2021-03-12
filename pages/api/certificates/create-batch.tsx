import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import startOrm from "../../../utils/initialize-database";
import { Template } from "../../../entities/Template";
import { Certificate } from "../../../entities/Certificate";

const toLowerJSONKeys = (obj) => {
  let keys = Object.keys(obj);
  var newobj: any = {};
  keys.forEach((key) => {
    newobj[key.toLowerCase()] = obj[key];
  });
  return newobj;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const orm = await startOrm();
  switch (req.method) {
    case "POST":
      const { templateId, certificates } = req.body;
      try {
        if (!templateId) {
          throw new Error("Missing templateID.");
        }
        const template = await orm.em.findOneOrFail(Template, {
          id: templateId,
        });
        console.log({ template });
        const certificateObjects = [];
        try {
          certificates.forEach((certificate) => {
            const lowerCert = toLowerJSONKeys(certificate);
            const newCertificate = new Certificate(
              lowerCert.name,
              lowerCert.email,
              template
            );
            certificateObjects.push(newCertificate);
          });
          await orm.em.persistAndFlush(certificateObjects);
        } catch (err) {
          console.log("Certificates Error:  ", err);
        }
        res.status(201).json({ certificates: certificateObjects });
      } catch (error) {
        console.log("Catched Error:  ", error);
        res.status(400).json({ error: error.message });
      }

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
