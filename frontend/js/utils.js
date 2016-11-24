import { FetchNotOkError } from './errors';

export function exceptCoreErrors(fn) {

  return (error) => {
    if ([TypeError, SyntaxError, ReferenceError].find(errorType => error instanceof errorType)) {
      throw error;
    } else {
      return fn(error);
    }
  };
}

export function errorIfStatusNot(statusCode) {
  return function(response) {
    if (response.status !== statusCode) {
      throw new FetchNotOkError(response);
    }
    return response;
  };
}

export function isFileApiSupported() {
  return (window.File && window.FileReader && window.FileList && window.Blob);
}


export function isMelindaId(id) {
  return id !== undefined && /^\d+$/.test(id);
}

export function isImportedRecordId(id) {
  return id !== undefined && /^[a-z0-9-]+$/.test(id);
}
