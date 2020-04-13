/**
 * request
 * api : https://github.com/umijs/umi-request
 */
import { getDvaApp } from 'umi';
import { extend } from 'umi-request';
import { notification } from 'antd';
import { formatMessage } from 'umi';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: 'Session Expired',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const errorHandler = error => {
  const { response, data } = error;
  if (response && response.status) {
    const { status, url } = response;
    const selectedText = data.data
      ? data.data.message
        ? data.data.message
        : data.message
      : data.message
      ? data.message
      : codeMessage[response.status];
    const errorText = `${status}: ${selectedText}`;
    console.log(`Request error: ${url}`, errorText);
    //    notification.error({
    //      description: errorText,
    //      message: `${url}`,
    //    });
    if (status === 401) {
      const redux_state = getDvaApp()._store.getState();
      if (redux_state.kz_login.data) {
        console.log('About to dispatch kz_login/logout');
        getDvaApp()._store.dispatch({ type: 'kz_login/logout' });
      } else {
        notification.error({
          message: formatMessage({ id: 'core.auth_error', defaultMessage: 'Error' }),
          description: formatMessage({
            id: 'core.please_try_again',
            defaultMessage: 'Please try again',
          }),
        });
      }
    }
  }
  return response;
};

const request = extend({
  errorHandler, // 默认错误处理
  //  credentials: 'include', // 默认请求是否带上cookie
});

export default request;
