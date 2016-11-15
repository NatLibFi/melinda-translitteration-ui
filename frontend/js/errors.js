
export function FetchNotOkError(response, errorReason) {
  var temp = Error.apply(this, [response.statusText]);
  temp.name = this.name = 'FetchNotOkError';
  this.stack = temp.stack;
  this.message = errorReason !== undefined ? errorReason : temp.message;
  this.response = response;
  this.status = response.status;
}

FetchNotOkError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: FetchNotOkError,
    writable: true,
    configurable: true
  }
});
