import React from 'react';
import { getDvaApp } from 'umi';
import Moment from 'react-moment';
import { gregorianToDate } from '@/pages/onnet-portal/core/utils/subroutine';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {caller_number, callee_number} from '../../utils/subroutine.ts';

const redux_state = getDvaApp()._store.getState();

export const columns = (onDrawerOpen, formatMessage) => [
  {
    title: formatMessage({ id: 'core.Date', defaultMessage: 'Date' }),
    dataIndex: 'timestamp',
    key: 'timestamp',
    align: 'center',
    render: (text) => <Moment format="DD.MM.YYYY HH:mm">{gregorianToDate(text)}</Moment>,
    sorter: (a, b) => a.timestamp - b.timestamp,
  },
  {
    title: formatMessage({ id: 'telephony.From', defaultMessage: 'From' }),
    key: 'caller_id_number',
    align: 'center',
    render: (text, record) => caller_number(record),
  },
  {
    title: formatMessage({ id: 'telephony.To', defaultMessage: 'To' }),
    key: 'callee_id_number',
    align: 'center',
    render: (text, record) => callee_number(record),
  },
  {
    title: formatMessage({ id: 'telephony.Duration', defaultMessage: 'Duration' }),
    key: 'call_duration',
    align: 'center',
    render: (text, record) => (
	    <div>{ record.billing_seconds } / { record.duration_seconds }</div>
    ),
  },
  {
    key: 'call_recording',
    align: 'center',
    render: (text, record) => (
	    <div>-</div>
    ),
  },
  {
    dataIndex: 'call_details',
    key: 'call_details',
    align: 'center',
    render: (text, record) => (
      <div style={{ color: redux_state.settings.primaryColor, cursor: 'pointer' }}>
        <InfoCircleOutlined />
      </div>
    ),
    onCell: (record) => {
      return {
        onClick: () => {
          onDrawerOpen(record);
        },
      };
    },
  },
];
