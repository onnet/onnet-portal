import { numbersClassifiers } from '../services/kazoo';

const KzNumbersClassifiersModel = {
  namespace: 'kz_numbers_classifiers',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(numbersClassifiers, payload);
      if (response?.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: { data: [], status: response?.status },
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

export default KzNumbersClassifiersModel;
