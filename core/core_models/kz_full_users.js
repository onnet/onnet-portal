import { getUser } from '../services/kazoo';

const Model = {
  namespace: 'kz_full_users',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'update',
        payload: { [payload.owner_id]: response },
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
      return { ...state, ...payload };
    },
  },
};

export default Model;
