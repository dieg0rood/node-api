class Response {
    constructor(httpStatus, message, data) {
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = httpStatus.code;
        this.httpStatus = httpStatus.status;
        this.message = message;
        this.data = data;
    }
}

export default Response;