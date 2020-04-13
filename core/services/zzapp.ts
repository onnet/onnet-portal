import { getDvaApp } from 'umi';
import request from '../utils/request_kazoo';
import { JSON_HEADERS, PDF_HEADERS } from './kazoo';

function accountsUrl(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}`;
  console.log(url);
  return url;
}

export function yandexMoneyPayment(params) {
  console.log('yandexMoneyPayment params: ', params);
  const url = `${accountsUrl(params)}/yandex_money_config/payment_url`;
  console.log('yandexMoneyPayment url: ', url);
  console.log('yandexMoneyPayment params: ', params);
  return request(url, {
    method: 'POST',
    headers: JSON_HEADERS(),
    data: params,
  });
}

export function createProformaInvoice(params) {
  console.log('yandexMoneyPayment params: ', params);
  const url = `${accountsUrl(params)}/onbill_proforma`;
  console.log('yandexMoneyPayment url: ', url);
  console.log('yandexMoneyPayment params: ', params);
  return request(url, {
    method: 'PUT',
    headers: JSON_HEADERS(),
    data: params,
  });
}

export function onbillsDoc(params) {
  console.log('onbillsDoc params: ', params);
  const url = `${accountsUrl(params)}/onbills/${params.doc_id}`;
  console.log('onbillsDoc url: ', url);
  console.log('onbillsDoc params: ', params);
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export function onbillsAttachment(params) {
  console.log('onbillsAttachment params: ', params);
  const url = `${accountsUrl(params)}/onbills/${params.doc_id}/attachment`;
  console.log('onbillsAttachment url: ', url);
  console.log('onbillsAttachment params: ', params);
  return request(url, {
    method: 'GET',
    headers: PDF_HEADERS(),
    responseType: 'blob',
  });
}
