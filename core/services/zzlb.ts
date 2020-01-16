import request from '../utils/request_kazoo';
import { JSON_HEADERS, PDF_HEADERS } from './kazoo';

function zzlbsUrl(params) {
  const redux_state = window.g_app._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/zzlbs`;
  return url;
}

export function lbAccountInfo(params) {
  const url = `${zzlbsUrl(params)}/account_info`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export function lbAccountDocs(params) {
  const url = `${zzlbsUrl(params)}/account_docs`;
  return request(url, {
    method: 'POST',
    headers: JSON_HEADERS(),
    data: { data: params.data },
  });
}

export function lbAccountDocsPDF(params) {
  const url = `${zzlbsUrl(params)}/account_docs?accept=pdf&period=${params.period}&order_id=${
    params.order_id
  }`;
  return request(url, {
    method: 'GET',
    headers: PDF_HEADERS(),
    responseType: 'blob',
  });
}

export function lbAccountCDR(params) {
  const url = `${zzlbsUrl(params)}/account_cdr`;
  return request(url, {
    method: 'POST',
    headers: JSON_HEADERS(),
    data: { data: params.data },
  });
}
