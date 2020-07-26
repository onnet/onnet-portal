import { Effect, Reducer, getDvaApp } from 'umi';
import { getUser } from '../services/kazoo';

export interface KazooUserModelType {
  namespace: 'kz_user';
  state: {};
  effects: {
    refresh: Effect;
    flush: Effect;
  };
  reducers: {
    update: Reducer<{}>;
  };
}

const KazooUserModel: KazooUserModelType = {
  namespace: 'kz_user',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      console.log('kz_users model payload.owner_id: ', payload.owner_id);
      if (payload.owner_id === 'no_user_defined') {
        yield put({
          type: 'update',
          payload: {
            data: {
              id: 'no_user_defined',
              first_name: 'Faceless',
              last_name: '',
              username: 'User',
              priv_level: 'user',
            },
          },
        });
        getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
        return;
      }
      const response = yield call(getUser, payload);
      if (response?.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: {},
        });
      }
      getDvaApp()._store.dispatch({ type: 'authority/refresh', payload: {} });
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

export default KazooUserModel;
