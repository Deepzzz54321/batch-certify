import {
  PrimaryKey,
  Entity,
  Property,
  SerializedPrimaryKey,
} from "@mikro-orm/core";
import { ObjectID } from "mongodb";

@Entity()
export class Template {
  @PrimaryKey()
  _id!: ObjectID;

  @SerializedPrimaryKey()
  id: string;

  @Property()
  name!: string;

  @Property()
  imageURL!: string;

  @Property({ type: "date" })
  createdAt = new Date();

  constructor(name: string, imageURL: string) {
    this.name = name;
    this.imageURL = imageURL;
  }
}
