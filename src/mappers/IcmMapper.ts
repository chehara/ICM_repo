import Nudges, {NudgesModel} from "../models/Nudges";
import {connectToDatabase} from "../common/db";

export const saveNudges = (nudges: NudgesModel) => {
    return new Promise( (resolve, reject) => {
        connectToDatabase().then(async ()=>{
            await Nudges.insertMany(nudges);
            return resolve('Done');
        });
    });
};

export const updateNudgeAction = (userId: number, firstName: string, deviceData: string) => {
    return new Promise(async (resolve: any, reject: any) => {
        try {
            connectToDatabase().then(async ()=>{
                const res = await Nudges.updateMany({ data: deviceData, 'user.id': userId}, { actioned: true });
                console.log(res);
                return resolve(1);
            });
        }catch (e) {
            console.log(e);
            return resolve(0);
        }
    });
};