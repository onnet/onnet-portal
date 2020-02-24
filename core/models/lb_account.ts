import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { lbAccountInfo } from '@/pages/onnet-portal/core/services/zzlb';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface LbAccountModelType {
  namespace: 'lb_account';
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const LbAccountModel: LbAccountModelType = {
  namespace: 'lb_account',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const redux_state = window.g_app._store.getState();
      if (!redux_state.lb_account.disabled) {
        const response = yield call(lbAccountInfo, payload);
        if (response.status === 404) {
          yield put({
            type: 'update',
            payload: { disabled: true },
          });
        } else {
          yield put({
            type: 'update',
            payload: response,
          });
          window.g_app._store.dispatch({ type: 'authority/refresh', payload: {} });
        }
      }
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

export default LbAccountModel;
