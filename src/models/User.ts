import { Document, model, Schema } from "mongoose";

export class User {
    id: number;
    firstName: string;
}
export interface IUserModel extends  Document {
    id: number;
    firstName: string;
}

export const UserSchema = new Schema(
    {
        id: Number,
        firstName: String
    },
    { timestamps: true }
);

export default model<IUserModel>('user', UserSchema, 'users');
