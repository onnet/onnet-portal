import React, { useState, useEffect, Fragment } from 'react';
import * as _ from 'lodash';
import Moment from 'react-moment';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';
import ReactJson from 'react-json-view';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';
import { useIntl, connect } from 'umi';
import { Drawer, Timeline, Collapse, Card } from 'antd';
import { gregorianToDate } from '@/pages/onnet-portal/core/utils/subroutine';
import { AccountCdrLegs } from '@/pages/onnet-portal/telephony/services/kazoo-telephony';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import styles from '@/pages/onnet-portal/core/style.less';
import CallLegDrawer from './CallLegDrawer';
import { caller_number, callee_number } from '../../utils/subroutine.ts';

const { Panel } = Collapse;

const CallDrawer = (props) => {
  const [isSelectedLegDrawerVisible, setIsSelectedLegDrawerVisible] = useState(false);
  const [selectedLeg, setSelectedLeg] = useState(false);
  const [callLegs, setCallLegs] = useState([]);

  const { settings, kz_account, child_account, selectedCall, onDrawerClose, isCallDrawerVisible } =
    props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });
  const { formatMessage } = useIntl();

  useEffect(() => {
    console.log('Inside useEffect selectedCall', selectedCall);
    if (kz_account.data) {
      console.log('Inside useEffect 2');
      if (
        ((kz_account?.data?.is_reseller && child_account.data) || kz_account?.data) &&
        selectedCall.id
      )
        setCallLegsState();
    }
  }, [kz_account, child_account, selectedCall]);

  function setCallLegsState() {
    setCallLegs([]);
    AccountCdrLegs({
      account_id: kz_account.data.is_reseller ? child_account.data.id : kz_account.data.id,
      call_id: selectedCall.id,
      method: 'GET',
    })
      .then((resp) => {
        console.log('AccountCdrLegs resp: ', resp);
        setCallLegs(resp.data);
      })
      .catch(() => console.log('Oops errors!'));
  }

  const items = callLegs
    .filter((value) => !value.channel_is_loopback)
    .map((leg) => (
      <Timeline.Item key={leg.id}>
        <Moment format="YYYY-MM-DD HH:mm:ss.SSS">{moment(leg.channel_created_time / 1000)}</Moment>
        {' ('}
        {leg.billing_seconds > 0 ? (
          <span style={{ color: settings.primaryColor }}>{leg.billing_seconds}</span>
        ) : (
          leg.billing_seconds
        )}
        /{leg.duration_seconds}
        {') '}
        <span
          style={{ cursor: 'pointer', color: settings.primaryColor }}
          onClick={() => {
            console.log('onClick key: ', leg);
            setSelectedLeg(leg);
            setIsSelectedLegDrawerVisible(true);
          }}
        >
          {leg.call_direction === 'outbound' ? (
            <>
              {leg.switch_hostname} {' -> '}{' '}
              {leg.user_agent ? leg.user_agent : _.split(leg.to, '@')[0]}
            </>
          ) : (
            <>
              {leg.user_agent} {' -> '} {leg.switch_hostname}
            </>
          )}
        </span>
        {' ('}
        {leg.hangup_cause}
        {') '}
      </Timeline.Item>
    ));

  const onSelectedLegDrawerClose = () => {
    setIsSelectedLegDrawerVisible(false);
    setSelectedLeg(false);
  };

  return (
    <>
      <Drawer
        title={
          selectedCall ? (
            <>
              <small>
                <Moment format="YYYY-MM-DD HH:mm:ss">
                  {gregorianToDate(selectedCall.timestamp)}
                </Moment>
              </small>{' '}
              <b style={{ color: settings.primaryColor }}>
                {` ${caller_number(selectedCall)} -> ${callee_number(selectedCall)} `}
              </b>
              <small>
                {' '}
                {`( ${selectedCall.billing_seconds} / ${selectedCall.duration_seconds} )`}
              </small>
            </>
          ) : null
        }
        width={isSmallDevice ? '100%' : '80%'}
        placement="right"
        onClose={onDrawerClose}
        open={isCallDrawerVisible}
      >
        <Collapse defaultActiveKey={['1']} accordion>
          <Panel
            header={formatMessage({
              id: 'telephony.Call_legs',
              defaultMessage: 'Call legs',
            })}
            key="1"
          >
            <Card hoverable className={styles.card} {...cardProps} key="cntoperations">
              <Card.Meta
                description={
                  <Fragment>
                    <Timeline style={{ marginTop: '1em' }}>{items}</Timeline>
                    <CallLegDrawer
                      selectedLeg={selectedLeg}
                      onSelectedLegDrawerClose={onSelectedLegDrawerClose}
                      isSelectedLegDrawerVisible={isSelectedLegDrawerVisible}
                    />
                  </Fragment>
                }
              />
            </Card>
          </Panel>
          <Panel
            header={`${formatMessage({
              id: 'core.Details',
              defaultMessage: 'Details',
            })}`}
            key="3"
          >
            <Card hoverable className={styles.card} {...cardProps} key="craneoperations">
              <Card.Meta description={<ReactJson src={selectedCall} {...reactJsonProps} />} />
            </Card>
          </Panel>
        </Collapse>
      </Drawer>
    </>
  );
};

export default connect(({ settings, kz_account, child_account }) => ({
  settings,
  kz_account,
  child_account,
}))(CallDrawer);
