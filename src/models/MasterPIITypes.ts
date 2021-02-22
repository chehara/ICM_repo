import { Document, model, Schema } from "mongoose";
import {RiskLevels} from "./RiskLevels";

export class MasterPIITypes {
    piiId: number;
    pii: string;
    riskLevel: RiskLevels
}
export interface IMasterPIITypesModel extends  Document {
    piiId: number;
    pii: string;
    riskLevel: RiskLevels
}

export const MasterPIITypesSchema = new Schema(
    {
        piiId: Number,
        pii: String,
        riskLevel: {type: Schema.Types.Mixed}
    },
    { timestamps: true }
);

export default model<IMasterPIITypesModel>('masterPIIType', MasterPIITypesSchema, 'masterPIITypes');
