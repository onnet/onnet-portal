import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { getUser } from '@/pages/onnet-portal/core/services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface KazooUserModelType {
  namespace: 'kazoo_user';
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
  namespace: 'kazoo_user',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
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
        window.g_app._store.dispatch({ type: 'authority/refresh', payload: {} });
        return;
      }
      const response = yield call(getUser, payload);
      if (response.status === 'success') {
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
      window.g_app._store.dispatch({ type: 'authority/refresh', payload: {} });
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
