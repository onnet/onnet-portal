import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'umi';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Table, Tag, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ReactJson from 'react-json-view';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';

function info(reg_details) {
  Modal.info({
    title: 'Message details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={reg_details} {...reactJsonProps} />,
    onOk() {},
  });
}

const CurrentMessages = (props) => {
  const { dispatch, kz_login, settings } = props;
  const [rows, setRows] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const connection = new WebSocket(settings.blackholeUrl);
  const { auth_token } = kz_login;

  useEffect(() => {
    setIsMounted(true);

    connection.onerror = (error) => {
      console.log(`WebSocket Error ${error}`);
    };

    connection.onclose = (e) => {
      console.log('connection closed');
      console.log(e.code, e.reason);
      console.log(e);
    };

    connection.onopen = (e) => {
      console.log('on ws open');
      console.log(e);
      connection.send(
        JSON.stringify({
          action: 'subscribe',
          auth_token,
          data: {
            account_id: '*',
            //      binding: 'zxx.*'
            binding: 'zportal.#',
          },
        }),
      );
    };

    connection.onmessage = (evt) => {
      if (isMounted) {
        const jsdata = JSON.parse(evt.data);
        if (jsdata.status !== 'error' && jsdata.action === 'event') {
          console.log('Action for event');
          console.log(jsdata.data);
          console.log(jsdata);
          console.log(evt);
          setRows({
            rows: rows.concat({
              key: jsdata.data.message.messageheader.messageid,
              created: jsdata.data.message.messageheader.created,
              sender: jsdata.data.message.messageheader.sender,
              receiver: jsdata.data.message.messageheader.receiver,
              event: Object.keys(jsdata.data.message.msgbody)[0],
              message: jsdata.data.message,
            }),
          });
        } else if (jsdata.status !== 'error') {
          console.log('Not an event action');
          console.log(jsdata);
        } else if (jsdata.data.errors[0].startsWith('failed to authenticate token')) {
          console.log(jsdata.data.errors[0]);
          dispatch({ type: 'kz_login/logout' });
        }
      }
    };

    return () => {
      setIsMounted(false);
    };
  }, []);

  //   const withWidth = true;
  const columns = [
    {
      key: 'created',
      dataIndex: 'created',
      title: 'Created',
      //        width: withWidth ? '15%' : undefined,
    },
    {
      key: 'sender',
      dataIndex: 'sender',
      align: 'center',
      title: 'Sender',
      //        width: withWidth ? '25%' : undefined,
    },
    {
      key: 'receiver',
      dataIndex: 'receiver',
      align: 'center',
      title: 'Receiver',
      //        width: withWidth ? '15%' : undefined,
    },
    {
      key: 'event',
      dataIndex: 'event',
      align: 'center',
      title: 'Event',
      //        width: withWidth ? '15%' : undefined,
    },
    {
      key: 'message',
      dataIndex: 'message',
      align: 'center',
      title: 'Message',
      render: (text, record) => (
        <Fragment>
          <InfoCircleOutlined
            onClick={(event) => {
              console.log('IAMS INFO OnClick');
              console.log(event);
              console.log(record);
              info(record.message);
            }}
          />
        </Fragment>
      ),

      //        width: withWidth ? '10%' : undefined,
    },
  ];

  return (
    <PageHeaderWrapper breadcrumb={false} tags={<Tag color="blue">{rows.length}</Tag>}>
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

export default connect(({ kz_login, settings }) => ({
  kz_login,
  settings,
}))(CurrentMessages);
