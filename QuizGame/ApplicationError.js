class ApplicationError extends Error {
    constructor(message, status) {
        // call default implementation, of Error
        super();
        this.message = message;
        this.status = status;
    }
}
module.exports = ApplicationError; 
