import { Document, model, Schema } from "mongoose";

export class PrivacyPolicy {
    policyId: number;
    event: string;
    actor: any;
    action: any;
    object: any;
    purpose: any;
}
export interface IPrivacyPolicyModel extends  Document {
    policyId: number;
    event: string;
    actor: any;
    action: any;
    object: any;
    purpose: any;
}

export const PrivacyPolicySchema = new Schema(
    {
        policyId: Number,
        event: String,
        actor: {type: Schema.Types.Mixed},
        action: {type: Schema.Types.Mixed},
        object: {type: Schema.Types.Mixed},
        purpose: {type: Schema.Types.Mixed}
    },
    { timestamps: true }
);

export default model<IPrivacyPolicyModel>('masterPrivacyPolicie', PrivacyPolicySchema, 'masterPrivacyPolicies');
