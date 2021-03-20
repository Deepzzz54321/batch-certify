import {
  PrimaryKey,
  Entity,
  Property,
  SerializedPrimaryKey,
  JsonType,
} from "@mikro-orm/core";
import { ObjectID } from "mongodb";
import { Crop } from "react-image-crop";

interface ImageAttribute {
  crop: Crop;
  scale: { x: number; y: number };
  fontSize: number;
}

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

  @Property({ type: JsonType })
  imageAttr!: ImageAttribute;

  @Property({ type: "date" })
  createdAt = new Date();

  constructor(name: string, imageURL: string, imageAttr: ImageAttribute) {
    this.name = name;
    this.imageURL = imageURL;
    this.imageAttr = imageAttr;
  }
}
