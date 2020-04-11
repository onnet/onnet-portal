import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { aGetAccount } from '../services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface KazooAccountModelType {
  namespace: 'kz_account';
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const KazooAccountModel: KazooAccountModelType = {
  namespace: 'kz_account',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(aGetAccount, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      yield window.g_app._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: response.data.id },
      });
      window.g_app._store.dispatch({ type: 'authority/refresh', payload: {} });
      window.g_app._store.dispatch({ type: 'kz_brief_users/refresh', payload });
      window.g_app._store.dispatch({ type: 'kz_brief_devices/refresh', payload });
      window.g_app._store.dispatch({ type: 'kz_numbers/refresh', payload });
    },
    *flush(_, { put }) {
      yield put({
        type: 'update',
        payload: {},
      });
    },
  },

  reducers: {
    update(state, { payload }) {
      return { ...payload };
    },
  },
};

export default KazooAccountModel;
