import { Context } from 'aws-lambda';

export enum Code{
    Success = 0,
    InternalError = 1000,
    SitNotFound= 1001
}
/**
 * HTTP status code enumeration.
 */
enum HttpCode {
    BadRequest = 400,
    InternalServerError = 500
}

class CustomError extends Error {
    readonly code: Code;
    readonly httpCode: HttpCode;

    constructor(code: Code, httpCode: HttpCode, message: string) {
        super(message);
        this.code = code;
        this.httpCode = httpCode;
    }
}
/**
 * Return the HTTP code error string as required for API gateway mapping template.
 */
function getHttpResponseString(code: HttpCode) {
    switch (code) {
        case HttpCode.BadRequest:
            return 'Bad Request';
        case HttpCode.InternalServerError:
            return 'Internal Server Error';
    }
}


export  function success(event: any, context: Context, response: any, meta: any = {}, jsonResponse = false) {

    let functionNameParts = context.functionName.split('-');

    // Strip Lambda suffix
    let lambdaNameSuffix = 'Lambda';
    let lambdaName = `${functionNameParts[3]}-`;
    for (let i = 0; i < lambdaNameSuffix.length; ++i) {
        lambdaName = lambdaName.replace(`${lambdaNameSuffix.substring(0, lambdaNameSuffix.length - i)}-`, '');
    }

    meta.stack = functionNameParts[1].replace('Stack', '');
    meta.action = lambdaName.replace('-', '');
    // TODO: Pass IRequest instead of event
    meta.identityId = event.identityId;
    meta.status = {
        code: Code.Success,
        name: Code[Code.Success]
    }
    if (jsonResponse) {
        meta.response = response;
    } else {
        meta.responseText = JSON.stringify(response);
    }
    console.log('API Success', meta)

    return response != undefined ? response : { message: 'Success' };
}

/**
 * Common helper method for API exception handling.
 */
export async function error(event: any, context: Context, error: Error, meta: any = {}) {
    try {
        if (error instanceof CustomError) {
            meta.status = {
                code: error.code,
                name: Code[error.code]
            }
            error.message = `${getHttpResponseString(error.httpCode)}: ${error.message}`;
        } else {
            meta.status = {
                code: Code.InternalError,
                name: Code[Code.InternalError]
            }
            error.message = `${getHttpResponseString(HttpCode.InternalServerError)}: ${error.message}`;
        }

        // Function name: pfe-EndUserApiStack-1RHTCGRKS01-DeviceCreateLambda-1WKQRRBS239H3
        let functionNameParts = context.functionName.split('-');

        // Strip Lambda suffix
        let lambdaNameSuffix = 'Lambda';
        let lambdaName = `${functionNameParts[3]}-`;
        for (let i = 0; i < lambdaNameSuffix.length; ++i) {
            lambdaName = lambdaName.replace(`${lambdaNameSuffix.substring(0, lambdaNameSuffix.length - i)}-`, '');
        }

        meta.stack = functionNameParts[1].replace('Stack', '');
        meta.action = lambdaName.replace('-', '');
        // TODO: Pass IRequest instead of event
        meta.identityId = event.identityId;
        console.log(error, meta)

        return error;

    } catch (e) {
        return new Error(`${getHttpResponseString(HttpCode.InternalServerError)}: ${error.message}`);
    }
}


/**
 * Base class for not found errors (not used directly).
 */
export class NotFoundError extends CustomError {

    constructor(status: Code, message: string) {
        super(status, HttpCode.BadRequest, message);
    }
}

export class siteNotFoundError extends NotFoundError {
    constructor(name: string) {
        super(Code.SitNotFound, `Site ${name} not found`);
    }
}
