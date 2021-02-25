class ManagerError extends Error
{
  constructor(message, status, leftOff)
  {
    // contain default functionality
    super();
    // custom
    this.message = message;
    this.status = status;
    this.leftOff = leftOff;
  }
}

module.exports = ManagerError;
