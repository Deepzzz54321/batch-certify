import {
  PrimaryKey,
  Entity,
  Property,
  SerializedPrimaryKey,
  ManyToOne,
} from "@mikro-orm/core";
import { ObjectID } from "mongodb";
import { Template } from "./Template";

@Entity()
export class Certificate {
  @PrimaryKey()
  _id!: ObjectID;

  @SerializedPrimaryKey()
  id: string;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @ManyToOne()
  template!: Template;

  @Property({ type: "date" })
  createdAt = new Date();

  constructor(name: string, email: string, template: Template) {
    this.name = name;
    this.email = email;
    this.template = template;
  }
}
