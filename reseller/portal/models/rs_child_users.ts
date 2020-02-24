import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { getUsers } from '@/pages/onnet-portal/core/services/kazoo';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    refreshAccountState: Effect;
  };
  reducers: {
    update: Reducer<{}>;
    flush: Reducer<{}>;
  };
}

const Model: ModelType = {
  namespace: 'rs_child_users',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const redux_state = window.g_app._store.getState();
      const response = yield call(getUsers, payload);
      yield put({
        type: 'update',
        payload: response,
      });
      response.data.map(user =>
        window.g_app._store.dispatch({
          type: 'rs_child_user/refresh',
          payload: { account_id: redux_state.rs_child_account.data.id, owner_id: user.id },
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
