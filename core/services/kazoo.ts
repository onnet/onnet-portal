import request from '../utils/request_kazoo';

export const JSON_HEADERS = () => {
  const redux_state = window.g_app._store.getState();
  return {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    'X-Auth-Token': redux_state.kazoo_login.auth_token,
  };
};

export const PDF_HEADERS = () => {
  const redux_state = window.g_app._store.getState();
  return {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/pdf',
    'X-Auth-Token': redux_state.kazoo_login.auth_token,
  };
};

export const MAYBE_SUPER_DUPER = () => {
  const redux_state = window.g_app._store.getState();
  if (redux_state.kazoo_account.data) {
    if (redux_state.kazoo_account.data.superduper_admin) {
      return redux_state.kazoo_account.data.superduper_admin === true;
    }
    return false;
  }
  return false;
};

export function kzRequest(url, params: FormDataTyp): Promise<any> {
  console.log('inside kzRequest');
  let dataBag;
  switch (params.method) {
    case 'GET':
    case 'DELETE':
      dataBag = {
        method: params.method,
        headers: JSON_HEADERS(),
      };
      break;

    default:
      console.log('inside default');
      dataBag = {
        method: params.method,
        headers: JSON_HEADERS(),
        data: { data: params.data },
      };
  }

  console.log('dataBag: ', dataBag);
  return request(url, dataBag);
}

export async function kz_user_auth(params) {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const result = request(`${API_URL_V2}/user_auth`, {
    method: 'PUT',
    data: params,
  });
  return result;
}

export async function getUser(params: FormDataTyp): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users/${params.owner_id}`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function getUsers(params: FormDataTyp): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users/`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

function userUrl(params) {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users/${params.owner_id}`;
  console.log(url);
  return url;
}

function usersUrl(params) {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users`;
  console.log(url);
  return url;
}

export function kzUsers(params: FormDataTyp) {
  return kzRequest(usersUrl(params), params);
}

export function kzUser(params: FormDataTyp) {
  return kzRequest(userUrl(params), params);
}

export function accountsUrl(params) {
  let url;
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  if (MAYBE_SUPER_DUPER() && params.method === 'PUT') {
    url = `${API_URL_V2}/accounts`;
    console.log(`Super_Duper Url: ${url}`);
  } else {
    url = `${API_URL_V2}/accounts/${params.account_id}`;
    console.log(`Not a Super_Duper Url: ${url}`);
  }

  console.log(url);
  return url;
}

export function kzAccount(params: FormDataTyp) {
  return kzRequest(accountsUrl(params), params);
}

export async function aKzAccount(params: FormDataTyp): Promise<any> {
  return kzAccount(params);
}

export function getAccount(params: FormDataTyp): Promise<any> {
  return request(accountsUrl(params), {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function aGetAccount(params: FormDataTyp): Promise<any> {
  return getAccount(params);
}

export function resellerStatus(params) {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/reseller`;
  return kzRequest(url, params);
}

export async function getResellerChildren(params: FormDataTyp): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/children`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function getResellerSIPRegistrations(params: FormDataTyp): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = redux_state.kazoo_account.data.superduper_admin
    ? `${API_URL_V2}/registrations`
    : `${API_URL_V2}/accounts/${params.account_id}/registrations`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function getResellerSIPRegistrationsCount(params: FormDataTyp): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = redux_state.kazoo_account.data.superduper_admin
    ? `${API_URL_V2}/registrations/count`
    : `${API_URL_V2}/accounts/${params.account_id}/registrations/count`;
  console.log('getResellerSIPRegistrationsCount url');
  console.log(url);
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export function getResellerChannels(params: FormDataTyp): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = redux_state.kazoo_account.data.superduper_admin
    ? `${API_URL_V2}/channels`
    : `${API_URL_V2}/accounts/${params.account_id}/channels`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function checkCurrentAuthToken(): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/auth/tokeninfo?token=${redux_state.kazoo_login.auth_token}`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function kzSystemStatus(): Promise<any> {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/system_status`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAndDispatch(fnName, dsName, params) {
  // eslint-disable-next-line no-eval
  eval(`${fnName}(params)`).then(res => {
    console.log('res');
    console.log(res);
    window.g_app._store.dispatch({
      type: dsName,
      payload: res,
    });
  });

  return 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAndDispatch2(fnName, dsName, params) {
  // eslint-disable-next-line no-eval
  eval(`${fnName}(params)`).then(res => {
    console.log('res');
    console.log(res);
    window.g_app._store.dispatch({
      type: dsName,
      payload: { account_id: params.account_id },
    });
  });

  return 0;
}
