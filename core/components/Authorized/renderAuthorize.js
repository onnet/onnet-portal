let CURRENT = 'NULL';

const renderAuthorize = (Authorized) => (currentAuthority) => {
  if (currentAuthority) {
    if (typeof currentAuthority === 'function') {
      CURRENT = currentAuthority();
    }
    if (
      Object.prototype.toString.call(currentAuthority) === '[object String]' ||
      Array.isArray(currentAuthority)
    ) {
      CURRENT = currentAuthority;
    }
  } else {
    CURRENT = 'NULL';
  }
  return Authorized;
};

export default (Authorized) => renderAuthorize(Authorized);
