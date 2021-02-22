import {Document, model, Schema} from "mongoose";
import {User} from "./User";

export class DeviceLogsModel {
    createdDate: string;
    user: User;
    deviceName: string;
    deviceToken: string;
    device: any;
    deviceType: string;
    eventId: number;
    event: string;
    detailNudge: any;
}

export interface IDeviceLogModel extends Document {
    createdDate: string;
    user: any;
    device: any;
    deviceToken: string;
    deviceName: string;
    deviceType: string;
    eventId: number;
    event: string;
    detailNudge: any;
}

export const DeviceLogSchema = new Schema(
    {
        createdDate: String,
        device: {type: Schema.Types.Mixed},
        user: {type: Schema.Types.Mixed},
        deviceToken: String,
        deviceName: String,
        deviceType: String,
        eventId: Number,
        event: String,
        detailNudge: {type: Schema.Types.Mixed}
    },
    {timestamps: true}
);

export default model<IDeviceLogModel>('deviceLog', DeviceLogSchema, 'deviceLogs');
