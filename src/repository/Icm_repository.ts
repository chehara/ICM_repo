import {connectToDatabase} from "../common/db";
import PrivacyPolicy from "../models/PrivacyPolicy";
import Device from "../models/DeviceModel";
import DeviceLogs, {DeviceLogsModel} from "../models/DeviceLogs";
import moment from "moment";
import * as AWS from "aws-sdk";
import {User} from "../models/User";
import * as Mapper from "../mappers/IcmMapper";
import Nudges, {NudgesModel} from "../models/Nudges";

export const triggerEvent = (payload: any) => {
    return new Promise(async (resolve: any, reject: any) => {
        const {deviceToken, eventId, event, deviceId} = payload;
        connectToDatabase().then(async () => {
            const deviceData: any = await Device.aggregate([
                {
                    "$project": {
                        "devices": "$$ROOT"
                    }
                },
                {
                    "$lookup": {
                        "localField": "devices.device.id",
                        "from": "masterEvents",
                        "foreignField": "devices.deviceId",
                        "as": "events"
                    }
                },
                {
                    $match: {
                        '$and': [
                            {
                                "devices.deviceToken": deviceToken
                            }
                        ]
                    },
                }
            ]);
            try {
                if (deviceData && deviceData[0] && deviceData[0].events) {
                    const eventModel: any = deviceData[0].events.filter((event: any) => event.eventId == eventId);
                    if (eventModel[0]) {
                        const privacyPolicyIds: number[] = eventModel[0].privacyStatement;
                        const privacyPolicies: any[] = await PrivacyPolicy.find({"policyId": {"$in": privacyPolicyIds}});
                        const results: any[] = [];
                        if (privacyPolicies && privacyPolicies.length > 0) {
                            privacyPolicies.forEach((policy) => {
                                const nudge: any = {};
                                const objects: any[] = [];
                                Object.keys(payload).forEach((eventKey: any) => {
                                    let objectValue: any = {};
                                    const endUserData = policy.object.endUserData.filter((userData: any) => userData.data == eventKey)[0];
                                    const privacyAvailability: boolean = endUserData ? endUserData.data == eventKey : false;
                                    objectValue = {};
                                    objectValue.name = eventKey;
                                    objectValue.availability = privacyAvailability;
                                    objectValue.piiType = endUserData ? endUserData.piiType : null;
                                    objectValue.allocatedService = endUserData ? endUserData.allocatedService : null;
                                    objects.push(objectValue);
                                });
                                nudge.policyId = policy.policyId;
                                nudge.action = policy.action;
                                nudge.policyResult = objects;
                                results.push(nudge);
                            });
                        }
                        const deviceLog: DeviceLogsModel = new DeviceLogs();
                        const device: any = deviceData[0].devices.device.filter((device: any) => device.id = deviceId)[0];
                        device.name = deviceData[0].devices.name;
                        deviceLog.createdDate = moment().format("yyyy-MM-DD");
                        deviceLog.deviceToken = deviceToken;
                        deviceLog.user = deviceData[0].devices.user;
                        deviceLog.device = device;
                        deviceLog.deviceType = deviceData[0].devices.device.type;
                        deviceLog.event = event;
                        deviceLog.eventId = eventId;
                        deviceLog.detailNudge = results;
                        await DeviceLogs.insertMany(deviceLog);
                        const iotData = new AWS.IotData({
                            endpoint: 'a2p6styvdw6gnr-ats.iot.us-east-1.amazonaws.com',
                            region: 'us-east-1'
                        });
                        let params = {
                            topic: "che01",
                            payload: JSON.stringify(payload),
                            qos: 0
                        };
                        iotData.publish(params, function (err, data) {
                            if (err) {
                                console.log("Error occurred : ", err);
                                return reject(err);
                            } else {
                                console.log('1')
                                return resolve('Success');
                            }
                        });
                        return resolve(results);
                    } else {
                        console.log("No device Found");
                        return resolve("No device Found");
                    }
                } else {
                    return resolve([]);
                }
            } catch (e) {
                console.log(e);
                return resolve("Something went wrong. Please contact provider");
            }
        });
    });
};

export const generateNudge = (event: any) => {
    return new Promise((resolve: any, reject: any) => {
        connectToDatabase().then(async () => {
            const deviceLogs: any[] = await DeviceLogs.find({
                $and: [
                    {
                        "createdDate": {
                            $lte: moment().format("yyyy-MM-DD"),
                            $gte: moment().subtract(7, 'days').format("yyyy-MM-DD")
                        }
                    },
                    {
                        "user.firstName": {
                            $eq: event.firstName
                        }
                    }
                ]
            });
            const devices: any[] = await Device.find({
                "user.firstName": {
                    $eq: event.firstName
                }
            });
            let userPreviousNudges: any[] = await Nudges.find({"user.id": event.userId, "actioned": false});
            let allActionedNudges: any[] = await Nudges.find({"actioned": true});
            let allNudges: any[] = await Nudges.find();
            if (devices && devices[0] && devices[0].device) {
                const deviceResults: any [] = [];
                devices[0].device.forEach((device: any) => {
                    deviceResults.push(generateNudgeDetails(devices, device, deviceLogs, device.type, userPreviousNudges,allActionedNudges,allNudges));
                });
                Promise.all(deviceResults).then(resultData => {
                    return resolve(resultData);
                })
            } else {
                return resolve("Not devices registered to this user.")
            }

        });
    });
};

export const generateNudgeDetails = (devices: any[], device: any, deviceLogs: any[], deviceType: string, userPreviousNudges: any, actionedNudges: any[], allNudges: any[]) => {
    return new Promise((resolve, reject) => {
        const deviceData: any = JSON.parse(JSON.stringify(devices[0]));
        const logs: any = deviceLogs.filter((deviceLog: DeviceLogsModel) => deviceLog.deviceToken == deviceData.deviceToken &&
            deviceLog.device.id == device.id);
        const results: any [] = [];
        let user: User = new User();
        if (logs.length > 0) {
            let detailNudges: any[] = [];
            for (let i = 0; i < logs.length; i++) {
                if (i == 0) {
                    detailNudges = logs[i].detailNudge;
                } else {
                    detailNudges = detailNudges.concat(logs[i].detailNudge);
                }
                user = logs[i].user;
            }
            results.push(generateNudgeStatement(detailNudges, "Collect", user, userPreviousNudges,actionedNudges,allNudges));
            results.push(generateNudgeStatement(detailNudges, "process", user, userPreviousNudges,actionedNudges,allNudges));
            // results.push({process: generateNudgeStatement(detailNudges, "process")});
        }
        Promise.all(results).then(resultData => {
            const response: any = {};
            console.log(deviceType);
            response.device = deviceType;
            response.deviceNudge = resultData;
            // response[deviceType] = resultData;
            return resolve(response);
        });

    });
};

// const generateResponse = (deviceResult: any) => {
//     return new Promise((resolve, reject) => {
//         return resolve(deviceResult);
//     });
// };

const generateNudgeStatement = (detailNudges: any, action: string, user: User, previousNudges: any, actionedNudges: any[], allNudges: any[]) => {
    return new Promise((resolve, reject) => {
        const collects: any[] = detailNudges.filter((nudge: any) => nudge.action.name === action);
        const collectNudges: string[] = [];
        const promiseArray: any[] = [];
        if (collects.length > 0) {
            let nudgePolicies: any[] = [];
            collects.forEach((collect: any) => {
                nudgePolicies = nudgePolicies.concat(collect.policyResult);
            });
            const uniqueNudgePolicies: any = nudgePolicies.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.place === thing.place && t.name === thing.name
                ))
            );
            uniqueNudgePolicies.forEach((nudge: any) => {
                if (nudge.availability) {
                    const previousNudge: any[] = previousNudges.filter((previousNudge: any) => previousNudge.data == nudge.name);
                    const count: number = nudgePolicies.filter((result: any) => result.name === nudge.name && result.availability).length;
                    const nudges: NudgesModel = new NudgesModel();
                    nudges.user = user;
                    nudges.data = nudge.name;
                    nudges.breachCount = count;
                    nudges.startDate = moment().subtract(7, 'days').format("yyyy-MM-DD");
                    nudges.endDate = moment().format("yyyy-MM-DD");
                    nudges.actioned = false;
                    let totalBreachCount: number = 0;
                    if (previousNudge.length > 0) {
                        totalBreachCount = totalBreachCount + previousNudge.map(item => item.breachCount).reduce((prev
                            , next) => prev + next);
                    }
                    if (previousNudge.length > 0) {
                        if (totalBreachCount > 2 && totalBreachCount <= 8) {
                            collectNudges.push(`Your ${nudge.name} has been ${action}ed ${count} times within ${nudges.startDate} to ${nudges.endDate}. ` +
                                `Consider changing privacy settings.`);
                        } else if (totalBreachCount > 15 && totalBreachCount <= 28) {
                            collectNudges.push(`Your ${nudge.name} has been ${action}ed ${count} times within ${nudges.startDate} to ${nudges.endDate} ` +
                                `You can easily minimise the possibility of suffering privacy breaches, if you disabled ${nudge.allocatedService}.`);
                        } else if (totalBreachCount > 29 && totalBreachCount <= 40) {
                            collectNudges.push(`Your ${nudge.name} has been ${action}ed ${count} times within ${nudges.startDate} to ${nudges.endDate} ` +
                                `If you don't disable your ${nudge.allocatedService}  privacy settings, your personal data could be compromised and` +
                                `you could be tracked or profiled`);
                        } else if (totalBreachCount > 40) {
                            let actionedCount: number = actionedNudges.filter(nudge => nudge.data == nudge.name).length;
                            let allCount: number = allNudges.filter(nudge => nudge.data == nudge.name).length;
                            let average: number = (actionedCount/allCount)*100;
                            console.log(actionedCount);
                            console.log(allCount);
                            collectNudges.push(`${average} percent of your colleagues do not share ${nudge.name} details with others`);
                        } else{
                            collectNudges.push(`Your ${nudge.name} has been ${action}ed ${count} times within ${nudges.startDate} to ${nudges.endDate}`);
                        }
                    } else {
                        collectNudges.push(`Your ${nudge.name} has been ${action}ed ${count} times within ${nudges.startDate} to ${nudges.endDate}`);
                    }
                    promiseArray.push(Mapper.saveNudges(nudges));
                }
            });
        }
        const response: any = {};
        response.action = action;
        response.data = collectNudges;
        // response[action] = collectNudges;
        return resolve(response);
        // Promise.all(promiseArray).then((data)=>{
        //     const response: any = {};
        //     response[action] = collectNudges;
        //     return resolve(response);
        // }).catch(error=>{
        //     console.log(error);
        //     return [];
        // });

    });
};

export const updateAction = (payload: any) => {
    return new Promise(async (resolve: any, reject: any) => {
        try {
            const {userId, firstName, deviceData} = payload;
            const updateStatus: any = await Mapper.updateNudgeAction(userId, firstName, deviceData);
            return resolve(updateStatus);
        } catch (e) {
            console.log(e);
            return resolve("Error =>>>>");
        }
    });
};


