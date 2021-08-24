import React, { useState, useEffect, Fragment } from 'react';
import { useIntl, connect } from 'umi';
import { Card, Switch, Table, DatePicker } from 'antd';
import { useMediaQuery } from 'react-responsive';
import * as _ from 'lodash';
import moment from 'moment';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { AccountCdrInteraction } from '@/pages/onnet-portal/telephony/services/kazoo-telephony';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import styles from '@/pages/onnet-portal/core/style.less';
import HeaderSearch from '@/pages/onnet-portal/core/components/HeaderSearch';
import gh_styles from '@/pages/onnet-portal/core/components/HeaderSearch/globhead.less';
import CallDrawer from '../components/CallDrawer';
import { columns } from './columns_cdr';
import ResellerChildFlush from '@/pages/onnet-portal/reseller/portal/components/ResellerChildFlush';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';
import ResellerChildrenTable from '@/pages/onnet-portal/reseller/portal/components/ResellerChildrenTable';
import { dateToGregorian } from '@/pages/onnet-portal/core/utils/subroutine';

const Statistics = (props) => {
  const [isPaginated, setIsPaginated] = useState({ position: 'bottom' });
  const [dataSource, setDataSource] = useState([]);
  const [dataCalls, setDataCalls] = useState([]);
  const [dataCallsQty, setDataCallsQty] = useState(0);
  const [isCallDrawerVisible, setIsCallDrawerVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState(false);
  const [dataSourceLoading, setDataSourceLoading] = useState(false);
  const [createdFrom, setCreatedFrom] = useState(moment().startOf('day'));
  const [createdTo, setCreatedTo] = useState(moment().endOf('day'));

  const { dispatch, kz_account, child_account } = props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (kz_account.data) {
      if ((kz_account?.data?.is_reseller && child_account.data) || kz_account?.data)
	    setCallsState();
      dispatch({
        type: 'kz_children/refresh',
        payload: { account_id: kz_account.data.id, method: 'GET' },
      });
    }
  }, [kz_account, child_account, createdTo, createdFrom]);

  function setCallsState() {
    setDataSourceLoading(true);
    setDataCalls([]);
    setDataCallsQty(0);
    setDataSource([]);
    AccountCdrInteraction({
      account_id: kz_account.data.is_reseller ? child_account.data.id : kz_account.data.id,
      created_to: dateToGregorian(createdTo.toDate()),
      created_from: dateToGregorian(createdFrom.toDate()),
      method: 'GET',
    })
      .then((resp) => {
        console.log('AccountCdrInteraction resp: ', resp);
        setDataCalls(resp.data);
        setDataCallsQty(resp.data.length);
        setDataSource(resp.data);
        setDataSourceLoading(false);
      })
      .catch(() => console.log('Oops errors!'));
  }

  const onSearchChange = (value) => {
    if (value.length > 1) {
      console.log('onSearchChange dataCalls: ', dataCalls);
      const searchRes = _.filter(dataCalls, (o) =>
        _.includes(_.toString(Object.values(o)).toLowerCase(), value.toLowerCase()),
      );
      setDataSource(searchRes);
    } else {
      setDataSource(dataCalls);
    }
  };

  const handlePagination = (e) => {
    if (e) {
      setIsPaginated({ position: 'bottom' });
    } else {
      setIsPaginated(false);
    }
  };

  const onDrawerOpen = (record) => {
    setSelectedCall(record);
    setIsCallDrawerVisible(true);
  };

  const onDrawerClose = () => {
    setIsCallDrawerVisible(false);
    setSelectedCall(false);
  };

  const myOnChange = (pagination, filters, sorter, currentDataSource) => {
    console.log('pagination :', pagination);
    console.log('currentDataSource :', currentDataSource);
  };

  function onDateChange(value, dateString) {
    if (value) {
      const sartOfDay = value.clone().startOf('day');
      const endOfDay = value.clone().endOf('day');
      setCreatedTo(endOfDay);
      setCreatedFrom(sartOfDay);
    }
  }

  if (!child_account) return null;

  return (
    <PageHeaderWrapper
      title={
        child_account.data
          ? child_account?.data?.name
          : formatMessage({ id: 'telephony.Statistics', defaultMessage: 'Statistics' })
      }
      subTitle={
        child_account.data ? (
          <>
            {formatMessage({
              id: 'telephony.CDR',
              defaultMessage: 'CDR',
            })}{' '}
            ({dataCallsQty})
          </>
        ) : null
      }
      key="pagewrapper"
      extra={
        kz_account?.data?.is_reseller
          ? [<ResellerChildFlush key="extraFlush" />, <ResellerChildSearch key="extraSearch" />]
          : null
      }
    >
      {(kz_account?.data?.is_reseller && child_account.data) || kz_account?.data ? (
        <Fragment>
          <Card hoverable className={styles.card} {...cardProps}>
            <Card.Meta
              title={
                <Fragment>
                  <>
                    {!isSmallDevice ? (
                      <>
                        <span style={{ marginLeft: '0.5em', display: 'inline-flex' }}>
                          {formatMessage({
                            id: 'core.Date',
                            defaultMessage: 'Date',
                          })}
                        </span>{' '}
                      </>
                    ) : null}
                    <DatePicker
                      format="DD.MM.YYYY"
                      style={{ marginLeft: '1em', display: 'inline-flex' }}
                      onChange={onDateChange}
                      defaultValue={createdFrom}
                    />
                  </>

                  <HeaderSearch
                    className={`${gh_styles.action} ${gh_styles.search}`}
                    style={{ marginLeft: '0.5em', display: 'inline-flex' }}
                    onSearch={(value) => {
                      console.log('input', value);
                    }}
                    onChange={onSearchChange}
                  />
                  <p style={{ float: 'right', display: 'inline-flex' }}>
                    {!isSmallDevice
                      ? `${formatMessage({
                          id: 'core.pagination',
                          defaultMessage: 'pagination',
                        })}: `
                      : null}
                    <Switch
                      style={{ marginLeft: '1em', marginTop: '0.4em' }}
                      checked={!!isPaginated}
                      onChange={handlePagination}
                      size="small"
                    />
                  </p>
                </Fragment>
              }
              description={
                <Table
                  dataSource={dataSource}
                  pagination={isPaginated}
                  loading={dataSourceLoading}
                  size="small"
                  style={{ backgroundColor: 'white' }}
                  columns={columns(onDrawerOpen, formatMessage)}
                  bordered
                  onChange={myOnChange}
                  rowKey={(record) => record.id}
                />
              }
            />
          </Card>
          <CallDrawer
            selectedCall={selectedCall}
            onDrawerClose={onDrawerClose}
            isCallDrawerVisible={isCallDrawerVisible}
          />
        </Fragment>
      ) : kz_account?.data?.is_reseller ? (
        <ResellerChildrenTable />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_login, kz_account, kz_children, child_account }) => ({
  kz_login,
  kz_account,
  kz_children,
  child_account,
}))(Statistics);
