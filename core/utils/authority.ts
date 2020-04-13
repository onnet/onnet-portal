import { getDvaApp } from 'umi';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(): string | string[] {
  try {
    const redux_state = getDvaApp()._store.getState();
    return redux_state.authority ? redux_state.authority.currentAuthority : [];
  } catch (e) {
    return ['no_auth'];
  }
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
