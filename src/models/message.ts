import { Schema, model } from "mongoose";
import Joi from "joi";

// Define the Message interface
export interface IMessage {
    _id?: string;
    name: string
    senderEmail: string;
    content: string;
    dateSent?: Date;
}

// Define the Mongoose schema for the Message model
const messageSchema: Schema<IMessage> = new Schema<IMessage>({
    name:  { type: String, required: true },
    senderEmail: { type: String, required: true },
    content: { type: String, required: true },
    dateSent: { type: Date, default: Date.now }
});

// Define and export the Message model
export const Message = model<IMessage>('Message', messageSchema);

// Define Joi validation schema for Message object
export const validateMessageObject = (message: IMessage) => {
    const schema = Joi.object({
        name: Joi.string().max(100).required(),
        senderEmail: Joi.string().email().required(),
        content: Joi.string().min(5).max(1024).required(),
        dateSent: Joi.date().optional()
    });

    return schema.validate(message);
};
