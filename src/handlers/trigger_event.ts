import {APIGatewayProxyHandler, Callback, Context} from "aws-lambda";
import * as status from "../lib/status";
import * as repository from "../repository/Icm_repository";


export const triggerEvent: APIGatewayProxyHandler = async (event: any, context: Context, callback: Callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try{
        const dataPayload = JSON.parse(event.body);
        console.log(dataPayload);
        const result: any = await repository.triggerEvent(dataPayload);
        return callback(undefined, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*",
            },
            body: JSON.stringify({result: result},null,2)
        })
    }catch(error){
        return callback(await status.error(event, context, error));
    }
};


export const generateNudge: APIGatewayProxyHandler = async (event: any, context: Context, callback: Callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try{
        const result: any = await repository.generateNudge(JSON.parse(event.body));
        return callback(undefined, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*",
            },
            body: JSON.stringify(result,null,2)
        })
    }catch(error){
        return callback(await status.error(event, context, error));
    }
};

export const updateAction: APIGatewayProxyHandler = async (event: any, context: Context, callback: Callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try{
        const result: any = await repository.updateAction(JSON.parse(event.body));
        return callback(undefined, {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin" : "*",
            },
            body: JSON.stringify(result,null,2)
        })
    }catch(error){
        return callback(await status.error(event, context, error));
    }
};
