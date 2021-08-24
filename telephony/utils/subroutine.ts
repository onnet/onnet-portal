export function caller_number(obj) {
  let caller_number;
  if (obj.caller_id_number) {
    caller_number = obj.caller_id_number;
  } else if (obj.from) {
    caller_number = _.split(obj.from, '@')[0];
  }
  return caller_number;
}

export function callee_number(obj) {
  let callee_number;
  if (obj.callee_id_number) {
    callee_number = obj.callee_id_number;
  } else if (obj.to) {
    callee_number = _.split(obj.to, '@')[0];
  }
  return callee_number;
}
