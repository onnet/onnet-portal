import * as _ from 'loadsh';

export function isArrayEqual(array1, array2) {
  return (
    array1.length === array2.length &&
    array1.sort().every((value, index) => value === array2.sort()[index])
  );
}

export function gregorianToDate(pTimestamp) {
  const timestamp = _.isString(pTimestamp) ? _.parseInt(pTimestamp) : pTimestamp;
  if (_.isNaN(timestamp) || !_.isNumber(timestamp)) {
    throw new Error('`timestamp` is not a valid Number');
  }
  return new Date((_.floor(timestamp) - 62167219200) * 1000);
}

export function dateToGregorian(date) {
  let formattedResponse;
  if (typeof date === 'object' && date) {
    formattedResponse = parseInt(date.getTime() / 1000 + 62167219200, 10);
  } else if (typeof date === 'number' && date) {
    formattedResponse = date + 62167219200;
  }
  return formattedResponse;
}
