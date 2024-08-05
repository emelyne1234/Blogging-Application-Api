import { Message, IMessage, validateMessageObject } from '../models/message';

export default class MessageService {

    // Create a new message
    static async createMessage(messageData: IMessage): Promise<IMessage> {
        const { error } = validateMessageObject(messageData);
        if (error) throw new Error(error.details[0].message);

        const message = new Message(messageData);
        return await message.save();
    }

    // Retrieve all messages
    static async getAllMessages(): Promise<IMessage[]> {
        return await Message.find();
    }

    // Retrieve a single message by ID
    static async getMessageById(messageId: string): Promise<IMessage | null> {
        return await Message.findById(messageId);
    }

    // Update a message
    static async updateMessage(messageId: string, messageData: IMessage): Promise<IMessage | null> {
        const { error } = validateMessageObject(messageData);
        if (error) throw new Error(error.details[0].message);

        return await Message.findByIdAndUpdate(messageId, messageData, { new: true });
    }

    // Delete a message
    static async deleteMessage(messageId: string): Promise<IMessage | null> {
        return await Message.findByIdAndDelete(messageId);
    }
}