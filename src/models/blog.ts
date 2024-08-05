import { Schema, model } from "mongoose";
import { IUser as User } from "./user";
import Joi from "joi";

// Defining the shape of my Blog
export interface IBlog {
  _id?: string;
  title: string;
  content: string;
  author: User["_id"];
  likes?: User["_id"][];
  comments?: string[];
  category?: string;
  status?: string,
  thumbnail?: string,
  dateCreated?: Date;
  dateUpdated?: Date;
}

// creating a schema
const blogSchema: Schema<IBlog> = new Schema<IBlog>({
  title: { type: String, required: true, minlength: 5 },
  content: { type: String, required: true, minlength: 50 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ["technology", "sports", "entertainment", "health", "business", "education"], required: true },
  thumbnail: {type: String, default:""},
  status: { type: String, enum: ["published", "archived"], default: "published" },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
},
  {
    timestamps: true
  });

export const Blog = model<IBlog>('Blog', blogSchema);

export const validateBlogObject = (blog: IBlog) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(50).required(),
    author: Joi.string().required(),
    category: Joi.string().required(),
    likes: Joi.array().items(Joi.string()),
    comments: Joi.array().items(Joi.string()),
    status:Joi.string().optional(),
    thumbnail:Joi.string().optional(),
  });

  return schema.validate(blog);
};





