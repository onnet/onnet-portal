import { getDvaApp } from 'umi';
import * as _ from 'lodash';

export function runAndDispatch(fnName, dsName, params) {
  fnName(params).then((res) => {
    console.log('res');
    console.log(res);
    getDvaApp()._store.dispatch({
      type: dsName,
      payload: res,
    });
  });

  return 0;
}

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

export function branchEndObjects(obj, acc) {
    for(var k in obj) {
        if(depthOf(obj[k]) > 1) {
          branchEndObjects(obj[k], acc);
        } else {
          if (obj[k].nomenclature_key) acc.push(obj[k]);
        };
    }
    return acc;
};

function depthOf(object) {
    var level = 1;
    for(var key in object) {
        if (!object.hasOwnProperty(key)) continue;

        if(typeof object[key] == 'object'){
            var depth = depthOf(object[key]) + 1;
            level = Math.max(depth, level);
        }
    }
    return level;
}

