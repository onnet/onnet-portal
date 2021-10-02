import { getDvaApp } from 'umi';
import { getUsers } from '../services/kazoo';

const Model = {
  namespace: 'kz_brief_users',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const redux_state = getDvaApp()._store.getState();
      const response = yield call(getUsers, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      response.data.map((user) =>
        getDvaApp()._store.dispatch({
          type: 'kz_full_users/refresh',
          payload: { account_id: redux_state.kz_account.data.id, owner_id: user.id },
        }),
      );
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
