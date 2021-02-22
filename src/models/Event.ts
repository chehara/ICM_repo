import { Document, model, Schema } from "mongoose";
import {DeviceModel} from "./DeviceModel";

export class Events {
    eventId: number;
    eventName: string;
    devices: DeviceModel[];
    privacyStatement: any;
}
export interface IEventModel extends  Document {
    eventId: number;
    eventName: string;
    devices: DeviceModel[];
    privacyStatement: any;
}

export const EventSchema = new Schema(
    {
        eventId: Number,
        eventName: String,
        devices: {type: Schema.Types.Mixed},
        privacyStatement: {type: Schema.Types.Mixed}
    },
    { timestamps: true }
);

export default model<IEventModel>('event', EventSchema, 'events');
