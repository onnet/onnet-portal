import { Effect, Reducer, getDvaApp } from 'umi';
import { EffectsCommandMap } from 'dva';
import { SIPRegistrationsCount } from '../services/kazoo';

export interface RsRegistrationsCountModelType {
  namespace: 'kz_registrations_count';
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const RsRegistrationsCountModel: RsRegistrationsCountModelType = {
  namespace: 'kz_registrations_count',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const redux_state = getDvaApp()._store.getState();
      if (redux_state.kz_account.data) {
        const response = yield call(SIPRegistrationsCount, payload);
        yield put({
          type: 'update',
          payload: response,
        });
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

export default RsRegistrationsCountModel;
