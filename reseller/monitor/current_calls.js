import React from 'react';
import { connect } from 'dva';
import { Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getResellerChannels } from '@/pages/onnet-portal/core/services/kazoo';
import AccountName from '@/pages/onnet-portal/core/components/account_name';
import * as subr from '@/pages/onnet-portal/core/utils/subroutine';
import Moment from 'react-moment';

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

class CurrentCalls extends React.Component {
  state = {
    rows: [],
  };

  componentDidMount() {
    console.log('subr.gregorianToDate(pTimestamp)');
    console.log(subr.gregorianToDate(63113932800));
    console.log('subr.dateToGregorian(new Date())');
    console.log(subr.dateToGregorian(new Date()));

    const connection = new WebSocket(this.props.settings.blackholeUrl);
    const { auth_token } = this.props.kazoo_login;

    if (this.props.kazoo_account.data) {
      this.initCurCalls();
    }

    connection.onerror = error => {
      console.log(`WebSocket Error ${error}`);
    };

    connection.onclose = e => {
      console.log('connection closed');
      console.log(e.code, e.reason);
      console.log(e);
    };

    connection.onopen = e => {
      console.log('on ws open');
      console.log(e);
      connection.send(
        JSON.stringify({
          action: 'subscribe',
          auth_token,
          data: {
            account_id: '*',
            binding: 'call.*.*',
          },
        }),
      );
    };

    connection.onmessage = evt => {
      const jsdata = JSON.parse(evt.data);
      if (jsdata.status !== 'error') {
        switch (jsdata.name) {
          case 'CHANNEL_CREATE':
            if (jsdata.data.call_direction === 'inbound') {
              console.log('CHANNEL_CREATE');
              console.log(jsdata);
              const cr_index = this.state.rows.findIndex(x => x.key === jsdata.data.call_id);
              if (cr_index === -1) {
                this.setState(prevState => {
                  const joined = prevState.rows.concat({
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
                  return { rows: joined };
                });
              }
            }
            break;
          case 'CHANNEL_ANSWER': {
            console.log('CHANNEL_ANSWER');
            console.log(jsdata);
            const ans_index = this.state.rows.findIndex(x => x.key === jsdata.data.call_id);
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
              this.setState(prevState => {
                const slicedArray = prevState.rows.slice();
                slicedArray.splice(ans_index, 1, answered_call);
                return { rows: slicedArray };
              });
            }
            break;
          }
          case 'CHANNEL_DESTROY': {
            this.setState(prevState => {
              const newrows = prevState.rows.filter(obj => obj.key !== jsdata.data.call_id);
              return { rows: newrows };
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
        this.props.dispatch({ type: 'kazoo_login/logout' });
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.kazoo_account.data && this.props.kazoo_account.data) {
      this.initCurCalls();
    }
  }

  initCurCalls = () => {
    const reqPayload = this.props.kazoo_account.data
      ? { account_id: this.props.kazoo_account.data.id }
      : {};
    getResellerChannels(reqPayload).then(respCurCalls => {
      if (respCurCalls.data) {
        const stateCandidate = respCurCalls.data
          .filter(value => value.direction === 'inbound')
          .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
          .map(call => {
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
        this.setState({ rows: stateCandidate });
      }
    });
  };

  render() {
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
      <PageHeaderWrapper tags={<Tag color="blue"> {this.state.rows.length} </Tag>}>
        <Table
          columns={columns}
          dataSource={this.state.rows}
          pagination={false}
          bordered
          size="small"
          style={{ backgroundColor: 'white' }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ kazoo_login, kazoo_account, settings }) => ({
  kazoo_login,
  kazoo_account,
  settings,
}))(CurrentCalls);
