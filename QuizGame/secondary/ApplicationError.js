class ApplicationError extends Error {
  constructor(message, status, before="/"){
    super();
    this.message = message;
    this.status = status;
    this.before = before;
  }
}

module.exports = ApplicationError;
