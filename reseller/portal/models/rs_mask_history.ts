import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';

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
  namespace: 'rs_mask_history',

  state: {},

  effects: {
    *demask(_, { put, select }) {
      console.log('Demask attempt');
      const state = yield select();
      console.log('Demask attempt state');
      console.log(state);
      const account_id = state.rs_mask_history.children.account_id
        ? state.rs_mask_history.children.account_id
        : state.kazoo_login.data.account_id;
      const owner_id = state.rs_mask_history.children.owner_id
        ? state.rs_mask_history.children.owner_id
        : state.kazoo_login.data.owner_id;
      yield window.g_app._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id },
      });
      yield window.g_app._store.dispatch({
        type: 'kazoo_account/refresh',
        payload: { account_id },
      });
      yield window.g_app._store.dispatch({
        type: 'kazoo_user/refresh',
        payload: { account_id, owner_id },
      });
      yield put({
        type: 'levelup',
      });
    },
    *mask({ payload }, { put }) {
      console.log('Model mask payload: ', payload);
      yield window.g_app._store.dispatch({
        type: 'lb_account/refresh',
        payload: { account_id: payload.account_id },
      });
      yield put({
        type: 'level_down',
        payload: { payload },
      });
    },
  },

  reducers: {
    level_down(state, { payload }) {
      return { ...payload, children: state };
    },
    levelup(state) {
      console.log('LevelUp attempt');
      return { ...state.children };
    },
  },
};

export default Model;
