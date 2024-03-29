import { getDvaApp } from 'umi';
import { SIPRegistrationsCount } from '../services/kazoo';

const RsRegistrationsCountModel = {
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
