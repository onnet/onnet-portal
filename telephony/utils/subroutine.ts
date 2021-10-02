import * as _ from 'lodash';

export function caller_number(obj) {
  let cn;
  if (obj.caller_id_number) {
    cn = obj.caller_id_number;
  } else if (obj.from) {
    cn = _.split(obj.from, '@')[0];
  }
  return cn;
}

export function callee_number(obj) {
  let ceen;
  if (obj.callee_id_number) {
    ceen = obj.callee_id_number;
  } else if (obj.to) {
    ceen = _.split(obj.to, '@')[0];
  }
  return ceen;
}
