import * as _ from 'lodash';

export function caller_number(obj) {
  let cn = 'undefined';
  const { caller_id_number, from } = obj;
  if (caller_id_number) {
    cn = caller_id_number;
  } else if (from) {
    [ cn ] = _.split(from, '@');
  }
  return cn;
}

export function callee_number(obj) {
  let ceen = 'undefined';
  const { callee_id_number, to } = obj;
  if (callee_id_number) {
    ceen = callee_id_number;
  } else if (to) {
    [ ceen ] = _.split(to, '@');
  }
  return ceen;
}
