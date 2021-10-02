import { getDvaApp } from 'umi';
import React from 'react';
import PromiseRender from './PromiseRender';

const checkPermissions = (
  authority,
  target,
  Exception
) => {
  if (!authority) {
    return target;
  }

  const redux_state = getDvaApp()._store.getState();
  const currentAuthority = redux_state.authority ? redux_state.authority.currentAuthority : [];
  const authorityException = authority
    .filter((element) => element.startsWith('!'))
    .map((elem) => elem.substring(1));

  if (Array.isArray(authority)) {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authorityException.includes(item))) {
        return Exception;
      }
    }
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority.includes(item))) {
        return target;
      }
    } else if (authority.includes(currentAuthority)) {
      return target;
    }
    return Exception;
  }
  if (typeof authority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some((item) => authority === item)) {
        return target;
      }
    } else if (authority === currentAuthority) {
      return target;
    }
    return Exception;
  }
  if (authority instanceof Promise) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  }
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      if (bool instanceof Promise) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

function check(authority, target, Exception) {
  return checkPermissions(authority, target, Exception);
}

export default check;
