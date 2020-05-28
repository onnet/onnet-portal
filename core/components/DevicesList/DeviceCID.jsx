import React, { Fragment } from 'react';
import { useIntl } from 'umi';
import { Table, Card } from 'antd';

import DeviceParagraph from './DeviceParagraph';
import DeviceCIDSelect from './DeviceCIDSelect';
import styles from '../style.less';
import { cardProps } from '../../utils/props';

const DeviceCID = props => {
  const { device_id } = props;
  const { formatMessage } = useIntl();

  const tableDataInternal = [
    {
      key: '1',
      name: formatMessage({
        id: 'core.CallerIDName',
        defaultMessage: 'Caller ID Name',
      }),
      value: (
        <DeviceParagraph
          fieldKey="caller_id.internal.name"
          device_id={device_id}
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
        <DeviceParagraph
          fieldKey="caller_id.internal.number"
          device_id={device_id}
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
        <DeviceParagraph
          fieldKey="caller_id.external.name"
          device_id={device_id}
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
        <DeviceCIDSelect
          fieldKey="caller_id.external.number"
          device_id={device_id}
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
        <DeviceParagraph
          fieldKey="caller_id.emergency.name"
          device_id={device_id}
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
        <DeviceCIDSelect
          fieldKey="caller_id.emergency.number"
          device_id={device_id}
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

export default DeviceCID;
