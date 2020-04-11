import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { kz_user_auth, checkCurrentAuthToken } from '../services/kazoo';

export function setUserLogin(payload) {
  return localStorage.setItem('userLogin', JSON.stringify(payload));
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface KazooLoginModelType {
  namespace: 'kz_login';
  state: {};
  effects: {
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<{}>;
  };
}

const KazooLoginModel: KazooLoginModelType = {
  namespace: 'kz_login',

  state: {
    ...JSON.parse(localStorage.getItem('userLogin')),
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(kz_user_auth, payload);
      if (response && response.status === 'success') {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        window.g_app._store.dispatch({
          type: 'kz_user/refresh',
          payload: { account_id: response.data.account_id, owner_id: response.data.owner_id },
        });
        window.g_app._store.dispatch({
          type: 'kz_account/refresh',
          payload: { account_id: response.data.account_id },
        });
        //       router.push('/dashboard');
      }
    },
    *check_auth(_, { call, put }) {
      const response = yield call(checkCurrentAuthToken);
      if (response && response.status !== 'success') {
        yield put({
          type: 'changeLoginStatus',
          payload: { currentAuthority: null },
        });
        window.g_app._store.dispatch({ type: 'kz_user/flush' });
        window.g_app._store.dispatch({ type: 'kz_account/flush' });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: { currentAuthority: null },
      });
      window.g_app._store.dispatch({ type: 'kz_user/flush' });
      window.g_app._store.dispatch({ type: 'kz_account/flush' });
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
