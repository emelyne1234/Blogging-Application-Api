import { Schema, model } from "mongoose";
import Joi from "joi";

// Define the Subscriber interface
export interface ISubscriber {
    _id?: string;
    email: string;
    status: string;
}

// Define the Mongoose schema for the Subscriber model
const subscriberSchema: Schema<ISubscriber> = new Schema<ISubscriber>({
    email: { type: String, required: true, unique: true },
    status: {type: String, enum:["active", "deactived"], default:"active"}
});

// Define and export the Subscriber model
export const Subscriber = model<ISubscriber>('Subscriber', subscriberSchema);

// Define Joi validation schema for Subscriber object
export const validateSubscriberObject = (subscriber: ISubscriber) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        status: Joi.string().optional()
    });

    return schema.validate(subscriber);
};
