import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

import styles from '@/pages/onnet-portal/core/style.less';

const CardAccountDetails = props => {
  const { lb_account = { data: {} } } = props;

  if (!lb_account.data.account_info) {
    return null;
  }

  const tableData = [
    {
      key: 'CardAccountDetailsRowKey1',
      name: <b>{lb_account.data.account_info.name}</b>,
    },
    {
      key: 'CardAccountDetailsRowKey2',
      name: 'Contact person',
      value: lb_account.data.account_info.kont_person,
    },
    {
      key: 'CardAccountDetailsRowKey3',
      name: 'Email',
      value: lb_account.data.account_info.emails ? (
        <Fragment>
          {lb_account.data.account_info.emails.map(email => (
            <Fragment key={`fragmentkey${email.replace(/[^A-Za-z0-9]/g, '')}`}>
              <span key={`spankey${email.replace(/[^A-Za-z0-9]/g, '')}`}>{email} </span>
            </Fragment>
          ))}
        </Fragment>
      ) : null,
    },
    {
      key: 'CardAccountDetailsRowKey4',
      name: 'Phone',
      value: lb_account.data.account_info.phones ? (
        <Fragment>
          {lb_account.data.account_info.phones.map(phone => (
            <Fragment key={`fragmentkey${phone.replace(/[^A-Za-z0-9]/g, '')}`}>
              <span key={`spankey${phone.replace(/[^A-Za-z0-9]/g, '')}`}>{phone} </span>
            </Fragment>
          ))}
        </Fragment>
      ) : null,
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (text, row, index) => {
        if (index === 0) {
          return {
            children: <a key={`name${index}`}>{text}</a>,
            props: {
              colSpan: 2,
            },
          };
        }
        return <a key={`name${index}`}>{text}</a>;
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, row, index) => {
        if (index === 0) {
          return {
            children: <a key={`value${index}`}>{text}</a>,
            props: {
              colSpan: 0,
            },
          };
        }
        return <a key={`value${index}`}>{text}</a>;
      },
    },
  ];

  return (
    <Card className={styles.card} {...cardProps}>
      <Card.Meta
        avatar={
          <img
            alt=""
            className={styles.cardAvatar}
            src="https://api.adorable.io/avatars/24/accountdetails.png"
          />
        }
        title={formatMessage({
          id: 'reseller_portal.account_details',
          defaultMessage: 'Account details',
        })}
        description={
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="small"
          />
        }
      />
    </Card>
  );
};

export default connect(({ lb_account }) => ({
  lb_account,
}))(CardAccountDetails);
