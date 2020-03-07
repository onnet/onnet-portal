import React, { Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Table, Card } from 'antd';

import RsChildUserParagraph from './RsChildUserParagraph';
import ResellerUserCIDSelect from './ResellerUserCIDSelect';
import styles from '../style.less';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';

const ResellerUserCID = props => {
  const { owner_id } = props;

  const tableDataInternal = [
    {
      key: '1',
      name: formatMessage({
        id: 'core.CallerIDName',
        defaultMessage: 'Caller ID Name',
      }),
      value: (
        <RsChildUserParagraph
          fieldKey="caller_id.internal.name"
          owner_id={owner_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      key: '2',
      name: formatMessage({
        id: 'core.CallerIDNumber',
        defaultMessage: 'Caller ID Number',
      }),
      value: (
        <RsChildUserParagraph
          fieldKey="caller_id.internal.number"
          owner_id={owner_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
  ];

  const tableDataOutbound = [
    {
      key: '1',
      name: formatMessage({
        id: 'core.CallerIDName',
        defaultMessage: 'Caller ID Name',
      }),
      value: (
        <RsChildUserParagraph
          fieldKey="caller_id.external.name"
          owner_id={owner_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      key: '2',
      name: formatMessage({
        id: 'core.CallerIDNumber',
        defaultMessage: 'Caller ID Number',
      }),
      value: (
        <ResellerUserCIDSelect
          fieldKey="caller_id.external.number"
          owner_id={owner_id}
          modal_title={formatMessage({
            id: 'core.ExternalCallerIDNumber',
            defaultMessage: 'External Caller ID Number',
          })}
        />
      ),
    },
  ];

  const tableDataEmergency = [
    {
      key: '1',
      name: formatMessage({
        id: 'core.CallerIDName',
        defaultMessage: 'Caller ID Name',
      }),
      value: (
        <RsChildUserParagraph
          fieldKey="caller_id.emergency.name"
          owner_id={owner_id}
          style={{ marginBottom: '0' }}
        />
      ),
    },
    {
      key: '2',
      name: formatMessage({
        id: 'core.CallerIDNumber',
        defaultMessage: 'Caller ID Number',
      }),
      value: (
        <ResellerUserCIDSelect
          fieldKey="caller_id.emergency.number"
          owner_id={owner_id}
          modal_title={formatMessage({
            id: 'core.EmergencyCallerIDNumber',
            defaultMessage: 'Emergency Caller ID Number',
          })}
        />
      ),
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      //    align: 'center',
    },
  ];

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'core.InHouseCalls',
                defaultMessage: 'In-House Calls',
              })}
            </Fragment>
          }
          description={
            <Table
              dataSource={tableDataInternal}
              columns={columns}
              pagination={false}
              showHeader={false}
              size="small"
            />
          }
        />
      </Card>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'core.OutboundCalls',
                defaultMessage: 'Outbound Calls',
              })}
            </Fragment>
          }
          description={
            <Table
              dataSource={tableDataOutbound}
              columns={columns}
              pagination={false}
              showHeader={false}
              size="small"
            />
          }
        />
      </Card>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'core.EmergencyCalls',
                defaultMessage: 'EmergencyCalls',
              })}
            </Fragment>
          }
          description={
            <Table
              dataSource={tableDataEmergency}
              columns={columns}
              pagination={false}
              showHeader={false}
              size="small"
            />
          }
        />
      </Card>
    </Fragment>
  );
};

export default connect(({ kazoo_login, kazoo_account, kz_children, child_account }) => ({
  kazoo_login,
  kazoo_account,
  kz_children,
  child_account,
}))(ResellerUserCID);
