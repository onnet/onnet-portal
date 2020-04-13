import { Effect, Reducer, getDvaApp } from 'umi';
import { EffectsCommandMap } from 'dva';
import { lbAccountInfo } from '../services/zzlb';

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
      const redux_state = getDvaApp()._store.getState();
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
          getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
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
