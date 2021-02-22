import {User} from "./User";
import {Document, model, Schema} from "mongoose";

export class NudgesModel {
    user: User;
    data: string;
    breachCount: number;
    startDate: string;
    endDate: string;
    actioned: boolean;
}

export interface INudgesModel extends  Document {
    user: User;
    data: string;
    breachCount: number;
    startDate: string;
    endDate: string;
    actioned: boolean;
}

export const NudgesSchema = new Schema(
    {
        user: {type: Schema.Types.Mixed},
        data: String,
        breachCount: Number,
        startDate: String,
        endDate: String,
        actioned: Boolean
    },
    { timestamps: true }
);
export default model<INudgesModel>('nudge', NudgesSchema, 'nudges');
