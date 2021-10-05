import { AccountCallflows } from '../services/kazoo-telephony';

const Model = {
  namespace: 'kz_cf_list',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountCallflows, { ...payload, method: 'GET' });
      yield put({
        type: 'update',
        payload: response,
      });
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

export default Model;
