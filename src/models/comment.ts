import { Schema, model } from "mongoose";
import { IUser as User } from "./user";
import { IBlog as Blog } from "./blog"; // Import the IBlog interface
import Joi from "joi";

export interface IComment {
    _id?: string;
    author: User["_id"];
    blog: Blog["_id"];
    content: string;
    dateCreated?: Date;
    dateUpdated?: Date;
}

const commentSchema: Schema<IComment> = new Schema<IComment>({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    content: { type: String, required: true },
}, {
    timestamps: true
});

export const Comment = model<IComment>('Comment', commentSchema);

export const validateCommentObject = (comment: IComment) => {
    const schema = Joi.object({
        author: Joi.string().required(),
        blog: Joi.string().required(),
        content: Joi.string().required().min(9)
    });

    return schema.validate(comment);
};
