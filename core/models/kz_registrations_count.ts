import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { SIPRegistrationsCount } from '@/pages/onnet-portal/core/services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

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
      const redux_state = window.g_app._store.getState();
      if (redux_state.kazoo_account.data) {
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
