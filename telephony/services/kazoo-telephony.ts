import { kzRequest, accountsUrl } from '@/pages/onnet-portal/core/services/kazoo';

export function AccountCallflows(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/callflows`, params);
}

export function AccountCallflow(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/callflows/${params.callflow_id}`, params);
}
