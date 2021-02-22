import { Document, model, Schema } from "mongoose";
import {MasterDevicesModel} from "./MasterDevices";
import {User} from "./User";

export class DeviceModel {
    deviceToken: number;
    name: string;
    user: User;
    device: MasterDevicesModel[]
}
export class DeviceUserModel {
    deviceId: number;
    deviceName: string;
    user: User;
    device: MasterDevicesModel[];
}
export interface IDeviceModel extends  Document {
    deviceId: number;
    deviceName: string;
    user: User;
    device: MasterDevicesModel[];
}

export const DeviceSchema = new Schema(
    {
        deviceId: Number,
        deviceName: String,
        user: {type: Schema.Types.Mixed},
        device: {type: Schema.Types.Mixed}
    },
    { timestamps: true }
);

export default model<IDeviceModel>('device', DeviceSchema, 'devices');
