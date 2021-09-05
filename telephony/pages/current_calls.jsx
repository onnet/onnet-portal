import React, { useState, useEffect, useRef } from 'react';
import { connect, useIntl } from 'umi';
import { Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getResellerChannels } from '@/pages/onnet-portal/telephony/services/kazoo-telephony';
import AccountName from '@/pages/onnet-portal/core/components/account_name';
import * as subr from '@/pages/onnet-portal/core/utils/subroutine';
import Moment from 'react-moment';
import ResellerChildFlush from '@/pages/onnet-portal/reseller/portal/components/ResellerChildFlush';
import ResellerChildSearch from '@/pages/onnet-portal/reseller/portal/components/ResellerChildSearch';

function get_calee_id_number(data_obj) {
  let callee_id_number;
  if (data_obj.callee_id_number) {
    ({ callee_id_number } = data_obj);
  } else if (data_obj.to) {
    callee_id_number = data_obj.to.split('@', 1);
  } else if (data_obj.destination) {
    callee_id_number = data_obj.destination;
  } else {
    callee_id_number = 'not_found';
  }
  return callee_id_number;
}

const CurrentCalls = (props) => {
  const { dispatch, kz_login, kz_account, settings, child_account } = props;
  const [rows, setRows] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const ws = useRef(null);

  const { formatMessage } = useIntl();

  const { auth_token } = kz_login;

  useEffect(() => {
    ws.current = new WebSocket(settings.blackholeUrl);

    ws.current.onerror = (error) => {
      console.log(`WebSocket Error ${error}`);
    };

    ws.current.onclose = (e) => {
      console.log('connection closed');
      console.log(e.code, e.reason);
      console.log(e);
    };

    return () => {
      ws.current.send(
        JSON.stringify({
          action: 'unsubscribe',
          auth_token,
          data: {
            account_id: '*',
            binding: 'call.*.*',
          },
        }),
      );
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    const accId =
      kz_account.data?.superduper_admin && !child_account?.data
        ? '*'
        : child_account?.data
        ? child_account?.data.id
        : kz_account.data?.id;

    console.log('ws.current.onopen account_id: ', accId);

    if (kz_account.data) {
      ws.current.onopen = (e) => {
        console.log('on ws open');
        console.log(e);
        ws.current.send(
          JSON.stringify({
            action: 'subscribe',
            auth_token,
            data: {
              //    account_id: '*',
              account_id: accId,
              binding: 'call.*.*',
            },
          }),
        );
      };

      initCurCalls();
    }
  }, [kz_account]);

  useEffect(() => {
    if (!ws.current) return;

    if (kz_account.data) {
      ws.current.onmessage = (evt) => {
        const jsdata = JSON.parse(evt.data);
        if (jsdata.status !== 'error') {
          switch (jsdata.name) {
            case 'CHANNEL_CREATE':
              if (jsdata.data.call_direction === 'inbound') {
                console.log('CHANNEL_CREATE');
                console.log(jsdata);
                const cr_index = rows.findIndex((x) => x.key === jsdata.data.call_id);
                if (cr_index === -1) {
                  setRows(() => {
                    const joined = rows.concat({
                      key: jsdata.data.call_id,
                      start_date: (
                        <Moment format="YYYY-MM-DD HH:mm">
                          {subr.gregorianToDate(jsdata.data.timestamp)}
                        </Moment>
                      ),
                      account_name: (
                        <AccountName account_id={jsdata.data.custom_channel_vars.account_id} />
                      ),
                      caller_id_number: jsdata.data.caller_id_number,
                      callee_id_number: get_calee_id_number(jsdata.data),
                      status: 'connecting',
                      duration: (
                        <Moment durationFromNow interval={1000}>
                          {subr.gregorianToDate(jsdata.data.timestamp)}
                        </Moment>
                      ),
                    });
                    return joined;
                  });
                }
              }
              break;
            case 'CHANNEL_ANSWER': {
              console.log('CHANNEL_ANSWER');
              console.log(jsdata);
              const ans_index = rows.findIndex((x) => x.key === jsdata.data.call_id);
              if (ans_index !== -1) {
                const answered_call = {
                  key: jsdata.data.call_id,
                  start_date: (
                    <Moment format="YYYY-MM-DD HH:mm">
                      {subr.gregorianToDate(jsdata.data.timestamp)}
                    </Moment>
                  ),
                  account_name: (
                    <AccountName account_id={jsdata.data.custom_channel_vars.account_id} />
                  ),
                  caller_id_number: jsdata.data.caller_id_number,
                  callee_id_number: get_calee_id_number(jsdata.data),
                  status: 'answered',
                  duration: (
                    <Moment durationFromNow interval={1000}>
                      {subr.gregorianToDate(jsdata.data.timestamp)}
                    </Moment>
                  ),
                };
                setRows(() => {
                  const slicedArray = rows.slice();
                  slicedArray.splice(ans_index, 1, answered_call);
                  return slicedArray;
                });
              }
              break;
            }
            case 'CHANNEL_DESTROY': {
              setRows(() => {
                const newrows = rows.filter((obj) => obj.key !== jsdata.data.call_id);
                return newrows;
              });
              break;
            }
            default:
              console.log('No action for event');
              console.log(jsdata);
              console.log(evt);
          }
        } else if (jsdata.data.errors[0].startsWith('failed to authenticate token')) {
          console.log(jsdata.data.errors[0]);
          dispatch({ type: 'kz_login/logout' });
        }
      };
    }
  }, [kz_account, rows]);

  const initCurCalls = () => {
    const reqPayload = kz_account.data ? { account_id: kz_account.data.id } : {};
    getResellerChannels(reqPayload).then((respCurCalls) => {
      if (respCurCalls.data) {
        const stateCandidate = respCurCalls.data
          .filter((value) => value.direction === 'inbound')
          .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
          .map((call) => {
            console.log('initCurCalls call');
            console.log(call);
            const callerID = call.caller_id_number;
            const calleeID = get_calee_id_number(call);
            const { destination } = call;
            return {
              key: call.uuid,
              start_date: (
                <Moment format="YYYY-MM-DD HH:mm">{subr.gregorianToDate(call.timestamp)}</Moment>
              ),
              account_name: (
                <AccountName
                  caller_id_number={callerID}
                  callee_id_number={calleeID}
                  destination={destination}
                />
              ),
              caller_id_number: callerID,
              callee_id_number: calleeID,
              status: call.answered ? 'answered' : 'connecting',
              duration: (
                <Moment durationFromNow interval={1000}>
                  {subr.gregorianToDate(call.timestamp)}
                </Moment>
              ),
            };
          });
        setRows(stateCandidate);
      }
    });
  };

  const withWidth = true;
  const columns = [
    {
      key: 'start_date',
      dataIndex: 'start_date',
      title: '',
      width: withWidth ? '15%' : undefined,
    },
    {
      key: 'account_name',
      dataIndex: 'account_name',
      title: 'Account',
      width: withWidth ? '25%' : undefined,
    },
    {
      key: 'caller_id_number',
      dataIndex: 'caller_id_number',
      title: 'Caller Number',
      width: withWidth ? '15%' : undefined,
    },
    {
      key: 'callee_id_number',
      dataIndex: 'callee_id_number',
      title: 'Callee Number',
      width: withWidth ? '15%' : undefined,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
      width: withWidth ? '10%' : undefined,
    },
    {
      key: 'duration',
      dataIndex: 'duration',
      title: 'Duration',
      width: withWidth ? '10%' : undefined,
    },
  ];

  return (
    <PageHeaderWrapper breadcrumb={false} tags={<Tag color="blue"> {rows.length} </Tag>}>
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        bordered
        size="small"
        style={{ backgroundColor: 'white' }}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_login, kz_account, settings, child_account }) => ({
  kz_login,
  kz_account,
  settings,
  child_account,
}))(CurrentCalls);
