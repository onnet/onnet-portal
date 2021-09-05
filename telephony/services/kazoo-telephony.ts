import { getDvaApp } from 'umi';
import { kzRequest, accountsUrl, timeRange } from '@/pages/onnet-portal/core/services/kazoo';

export function AccountCallflows(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/callflows`, params);
}

export function AccountCallflow(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/callflows/${params.callflow_id}`, params);
}

export function AccountCdrInteraction(params: FormDataTyp): Promise<any> {
  return kzRequest(
    `${accountsUrl(params)}/cdrs/interaction${timeRange(params)}&paginate=false`,
    params,
  );
}

export function AccountCdrLegs(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/cdrs/legs/${params.call_id}`, params);
}

export async function getSIPRegistrations(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const path =
    redux_state.kz_account.data.superduper_admin && !redux_state.child_account?.data
      ? `${API_URL_V2}/registrations`
      : `${accountsUrl(params)}/registrations`;
  return kzRequest(path, params);
}

export async function SIPRegistrationsCount(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url =
    redux_state.kz_account.data.superduper_admin && !redux_state.child_account?.data
      ? `${API_URL_V2}/registrations/count`
      : `${accountsUrl(params)}/registrations/count`;
  return kzRequest(path, params);
}

export function getResellerChannels(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const path = redux_state.kz_account.data.superduper_admin
    ? `${API_URL_V2}/channels`
    : `${accountsUrl(params)}/channels`;
  return kzRequest(path, params);
}
