import { lbAccountDocs } from '@/pages/onnet-portal/core/services/zzlb';

const Model = {
  namespace: 'lb_documents',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(lbAccountDocs, payload);
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
