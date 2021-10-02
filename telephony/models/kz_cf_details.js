import { EffectsCommandMap } from 'dva';
import { AccountCallflow } from '../services/kazoo-telephony';

const Model = {
  namespace: 'kz_cf_details',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountCallflow, { ...payload, method: 'GET' });
      yield put({
        type: 'update',
        payload: response,
      });
    },
    *flush(_, { put }) {
      yield put({
        type: 'flush_all',
        payload: {},
      });
    },
  },

  reducers: {
    update(state, { payload }) {
      return { ...state, [payload.data.id]: payload.data };
    },
    flush_all(state, { payload }) {
      return { payload };
    },
  },
};

export default Model;
