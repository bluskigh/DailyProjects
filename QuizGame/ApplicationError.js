class ApplicationError extends Error {
    constructor(message, status, where) {
        // call default implementation, of Error
        super();
        this.message = message;
        this.status = status;
        this.where = where;
    }
}
module.exports = ApplicationError; 
