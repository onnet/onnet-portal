import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { AccountNumbers } from '../services/kazoo';

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
  namespace: 'kz_numbers',

  state: {},

  effects: {
    *refresh({ payload }, { call, put }) {
      const response = yield call(AccountNumbers, payload);
      if (response.status === 'success') {
        yield put({
          type: 'update',
          payload: response,
        });
      } else {
        yield put({
          type: 'update',
          payload: { data: [], status: response.status },
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

export default Model;
