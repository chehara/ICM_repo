import { Document, model, Schema } from "mongoose";

export class MasterDevicesModel {
    deviceId: number;
    deviceName: string;
}
export interface IMasterDevicesModel extends  Document {
    deviceId: number;
    deviceName: string;
}

export const MasterDevicesSchema = new Schema(
    {
        deviceId: Number,
        deviceName: String
    },
    { timestamps: true }
);

export default model<IMasterDevicesModel>('masterDevices', MasterDevicesSchema, 'masterDevices');
