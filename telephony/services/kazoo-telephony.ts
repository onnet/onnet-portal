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
