import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { aGetAccount } from '@/pages/onnet-portal/core/services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface KazooAccountModelType {
  namespace: 'kazoo_account';
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
  namespace: 'kazoo_account',

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
