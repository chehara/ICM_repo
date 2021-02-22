import { Document, model, Schema } from "mongoose";

export class RiskLevels {
    id: number;
    level: string;
    name: string
}
export interface IRiskLevelsModel extends  Document {
    deviceId: number;
    deviceName: string;
}

export const RiskLevelsSchema = new Schema(
    {
        deviceId: Number,
        deviceName: String
    },
    { timestamps: true }
);

export default model<IRiskLevelsModel>('masterRiskLevel', RiskLevelsSchema, 'masterRiskLevels');
