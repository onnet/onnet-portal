import { getDvaApp } from 'umi';
import { kz_user_auth, checkCurrentAuthToken } from '../services/kazoo';

export function setUserLogin(payload) {
  return localStorage.setItem('userLogin', JSON.stringify(payload));
}

const KazooLoginModel = {
  namespace: 'kz_login',

  state: {
    ...JSON.parse(localStorage.getItem('userLogin')),
    iamtest: 'hello',
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(kz_user_auth, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        getDvaApp()._store.dispatch({
          type: 'kz_user/refresh',
          payload: { account_id: response.data.account_id, owner_id: response.data.owner_id },
        });
        getDvaApp()._store.dispatch({
          type: 'kz_account/refresh',
          payload: { account_id: response.data.account_id },
        });
      }
    },
    *check_auth(_, { call, put }) {
      const response = yield call(checkCurrentAuthToken);
      if (response && response.status !== 'success') {
        yield put({
          type: 'changeLoginStatus',
          payload: { currentAuthority: null },
        });
        getDvaApp()._store.dispatch({ type: 'kz_user/flush' });
        getDvaApp()._store.dispatch({ type: 'kz_account/flush' });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: { currentAuthority: null },
      });
      getDvaApp()._store.dispatch({ type: 'kz_user/flush' });
      getDvaApp()._store.dispatch({ type: 'kz_account/flush' });
      window.location.replace('/');
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setUserLogin(payload);
      return { ...payload };
    },
  },
};

export default KazooLoginModel;
