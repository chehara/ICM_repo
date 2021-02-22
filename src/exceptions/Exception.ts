class BaseError {
    constructor() {
        Error.apply(this);
    }
}

export class Exception extends BaseError{

    constructor(statusCode: number, message: string) {
        super();
    }
}
