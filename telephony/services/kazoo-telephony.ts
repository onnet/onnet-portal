import { kzRequest, accountsUrl } from '@/pages/onnet-portal/core/services/kazoo';

export function AccountNumbers(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/phone_numbers`, params);
}

export function AccountMedia(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/media`, params);
}
