import { kzRequest, accountsUrl } from '@/pages/onnet-portal/core/services/kazoo';

export function AccountNumbers(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/phone_numbers`, params);
}

export function AccountMedia(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/media`, params);
}

export function AccountDialplans(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/dialplans`, params);
}

export function AccountCallflows(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/callflows`, params);
}

export function AccountCallflow(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/callflows/${params.callflow_id}`, params);
}
