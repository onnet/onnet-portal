import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, DatePicker, Radio } from 'antd';
import styles from '../style.less';
import CardCDR from './CardCDR';

import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const dayFormat = 'YYYY/MM/DD';

const LbStatistics = props => {
  const { dispatch, lb_statistics, lb_account, kazoo_account } = props;

  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MM'));
  const [selectedDay, setSelectedDay] = useState(moment().format('DD'));
  const [callsDirection, setCallsDirection] = useState('1');
  const [callsType, setCallsType] = useState('1,2,3,4');

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'lb_statistics/refresh',
        payload: {
          method: 'POST',
          account_id: kazoo_account.data.id,
          data: {
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay,
            direction: callsDirection,
            calls_type: callsType,
          },
        },
      });
    }
  }, [kazoo_account]);

  const handleCallsDirection = e => {
    dispatch({ type: 'lb_statistics/is_loading' });
    console.log('handleCallsDirection value: ', e.target.value);
    setCallsDirection(e.target.value);
    console.log('CallsDirection value: ', callsDirection);
    dispatch({
      type: 'lb_statistics/refresh',
      payload: {
        method: 'POST',
        account_id: kazoo_account.data.id,
        data: {
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
          direction: e.target.value,
          calls_type: e.target.value === '1' ? callsType : '1,2,3,4',
        },
      },
    });
  };

  const handleCallsType = e => {
    dispatch({ type: 'lb_statistics/is_loading' });
    console.log('handleCallsType value: ', e.target.value);
    setCallsType(e.target.value);
    console.log('CallsType value: ', callsType);
    dispatch({
      type: 'lb_statistics/refresh',
      payload: {
        method: 'POST',
        account_id: kazoo_account.data.id,
        data: {
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
          direction: callsDirection,
          calls_type: e.target.value,
        },
      },
    });
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <p>
          {formatMessage({
            id: 'reseller_portal.Account_status',
            defaultMessage: 'Account status',
          })}
        </p>
        <p>Active</p>
      </div>
      <div className={styles.statItem}>
        <p>
          {formatMessage({
            id: 'reseller_portal.Current_balance',
            defaultMessage: 'Current balance',
          })}
        </p>
        {lb_account.data ? (
          <NumberFormat
            value={lb_account.data.account_balance}
            displayType="text"
            thousandSeparator=" "
            decimalScale={2}
            renderText={value => <div>{value} руб.</div>}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <PageHeaderWrapper extra={extraContent}>
      {lb_statistics ? (
        <Fragment>
          <Row gutter={24}>
            <Form
              layout="inline"
              className="components-table-demo-control-bar"
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                label={formatMessage({ id: 'reseller_portal.Period', defaultMessage: 'Period' })}
              >
                <DatePicker
                  defaultValue={moment(
                    `${selectedYear}/${selectedMonth}/${selectedDay}`,
                    dayFormat,
                  )}
                  format={dayFormat}
                  allowClear={false}
                  onChange={date => {
                    setSelectedDay(date.format('DD'));
                    setSelectedMonth(date.format('MM'));
                    setSelectedYear(date.format('YYYY'));
                    dispatch({
                      type: 'lb_statistics/refresh',
                      payload: {
                        method: 'POST',
                        account_id: kazoo_account.data.id,
                        data: {
                          year: date.format('YYYY'),
                          month: date.format('MM'),
                          day: date.format('DD'),
                          direction: callsDirection,
                          calls_type: callsDirection === '1' ? callsType : '1,2,3,4',
                        },
                      },
                    });
                  }}
                />
              </Form.Item>
              <br />
              <Form.Item
                label={formatMessage({
                  id: 'reseller_portal.Calls_direction',
                  defaultMessage: 'Calls direction',
                })}
              >
                <Radio.Group value={callsDirection} onChange={handleCallsDirection}>
                  <Radio.Button value="1">
                    {formatMessage({
                      id: 'reseller_portal.Outbound_calls',
                      defaultMessage: 'Outbound calls',
                    })}
                  </Radio.Button>
                  <Radio.Button value="0">
                    {formatMessage({
                      id: 'reseller_portal.Inbound_calls',
                      defaultMessage: 'Inbound calls',
                    })}
                  </Radio.Button>
                  <Radio.Button value="0,1">
                    {formatMessage({ id: 'reseller_portal.All_calls', defaultMessage: 'All' })}
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              {callsDirection === '1' ? (
                <Form.Item
                  label={formatMessage({
                    id: 'reseller_portal.Calls_type',
                    defaultMessage: 'Calls type',
                  })}
                >
                  <Radio.Group value={callsType} onChange={handleCallsType}>
                    <Radio.Button value="1,2,3,4">
                      {formatMessage({
                        id: 'reseller_portal.All_calls',
                        defaultMessage: 'All calls',
                      })}
                    </Radio.Button>
                    <Radio.Button value="1">
                      {formatMessage({
                        id: 'reseller_portal.Local_calls',
                        defaultMessage: 'Local calls',
                      })}
                    </Radio.Button>
                    <Radio.Button value="2,3,4">
                      {formatMessage({
                        id: 'reseller_portal.Long_distance_calls',
                        defaultMessage: 'Long distance calls',
                      })}
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              ) : null}
            </Form>
          </Row>

          <Row gutter={24}>
            <Col key="colkey11">
              <CardCDR {...cardProps} />
            </Col>
          </Row>
        </Fragment>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ lb_statistics, lb_account, kazoo_account }) => ({
  lb_statistics,
  lb_account,
  kazoo_account,
}))(LbStatistics);
