import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'lodash';
import { Typography } from 'antd';
import { kzDevice } from '@/pages/onnet-portal/core/services/kazoo';

const { Paragraph } = Typography;

const DeviceParagraph = props => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const { dispatch, account, full_devices, device_id, fieldKey } = props;

  useEffect(() => {
    if (full_devices[device_id]) {
      setFieldContent(_.get(full_devices[device_id].data, fieldKey));
    }
  }, [full_devices[device_id]]);

  return (
    <Paragraph
      style={props.style}
      editable={{
        onChange: updatedText => {
          if (fieldContent !== updatedText) {
            const data = {};
            _.set(data, fieldKey, updatedText);
            kzDevice({
              method: 'PATCH',
              account_id: account.data.id,
              device_id,
              data,
            }).then(() =>
              dispatch({
                type: 'kz_full_devices/refresh',
                payload: { account_id: account.data.id, device_id },
              }),
            );
          }
        },
      }}
    >
      {fieldContent}
    </Paragraph>
  );
};

export default connect(({ kz_account, kz_full_devices }) => ({
  account: kz_account,
  full_devices: kz_full_devices,
}))(DeviceParagraph);
