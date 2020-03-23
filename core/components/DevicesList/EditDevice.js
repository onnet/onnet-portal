import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ReactJson from 'react-json-view';
import DeviceCID from './DeviceCID';
import DeviceDiversion from './DeviceDiversion';
import DeviceMedia from './DeviceMedia';
import DeviceRestrictions from './DeviceRestrictions';
import DeviceSettings from './DeviceSettings';
import DeviceSIPSettings from './DeviceSIPSettings';
import DeviceSIPURISettings from './DeviceSIPURISettings';
import DeviceCellPhoneSettings from './DeviceCellPhoneSettings';
import DeviceFMCSettings from './DeviceFMCSettings';

const { Panel } = Collapse;

const defaultProps = {
  theme: 'rjv-default',
  collapsed: false,
  collapseStringsAfter: 15,
  onAdd: false,
  onEdit: false,
  onDelete: false,
  displayObjectSize: false,
  enableClipboard: false,
  indentWidth: 4,
  displayDataTypes: false,
  iconStyle: 'triangle',
};

const EditDevice = props => {
  const { selectedDevice, full_devices, disableAssignBtn } = props;

  if (!selectedDevice) return null;
  if (!full_devices[selectedDevice]) return null;

  let devSettings = null;

  if (
    full_devices[selectedDevice].data.device_type === 'softphone' ||
    full_devices[selectedDevice].data.device_type === 'sip_device' ||
    full_devices[selectedDevice].data.device_type === 'fax'
  ) {
    devSettings = (
      <DeviceSIPSettings device_id={selectedDevice} disableAssignBtn={disableAssignBtn} />
    );
  } else if (full_devices[selectedDevice].data.device_type === 'sip_uri') {
    devSettings = (
      <DeviceSIPURISettings device_id={selectedDevice} disableAssignBtn={disableAssignBtn} />
    );
  } else if (full_devices[selectedDevice].data.device_type === 'cellphone') {
    devSettings = (
      <DeviceCellPhoneSettings device_id={selectedDevice} disableAssignBtn={disableAssignBtn} />
    );
  } else if (full_devices[selectedDevice].data.device_type === 'sip_fmc') {
    devSettings = (
      <DeviceFMCSettings device_id={selectedDevice} disableAssignBtn={disableAssignBtn} />
    );
  } else {
    devSettings = <DeviceSettings device_id={selectedDevice} disableAssignBtn={disableAssignBtn} />;
  }

  return (
    <Collapse accordion>
      <Panel
        header={formatMessage({ id: 'core.Device_settings', defaultMessage: 'Device settings' })}
        key="20"
      >
        {devSettings}
      </Panel>
      <Panel header={formatMessage({ id: 'core.CID', defaultMessage: 'CID' })} key="21">
        <DeviceCID device_id={selectedDevice} />
      </Panel>

      {full_devices[selectedDevice].data.device_type === 'softphone' ||
      full_devices[selectedDevice].data.device_type === 'sip_device' ||
      full_devices[selectedDevice].data.device_type === 'fax' ? (
        <Panel
          header={formatMessage({ id: 'core.Diversion', defaultMessage: 'Diversion' })}
          key="22"
        >
          <DeviceDiversion device_id={selectedDevice} />
        </Panel>
      ) : null}

      {full_devices[selectedDevice].data.device_type === 'softphone' ||
      full_devices[selectedDevice].data.device_type === 'sip_device' ||
      full_devices[selectedDevice].data.device_type === 'sip_uri' ||
      full_devices[selectedDevice].data.device_type === 'fax' ? (
        <Panel header={formatMessage({ id: 'core.Media', defaultMessage: 'Media' })} key="23">
          <DeviceMedia device_id={selectedDevice} />
        </Panel>
      ) : null}

      {full_devices[selectedDevice].data.device_type === 'softphone' ||
      full_devices[selectedDevice].data.device_type === 'sip_device' ||
      full_devices[selectedDevice].data.device_type === 'sip_uri' ||
      full_devices[selectedDevice].data.device_type === 'fax' ? (
        <Panel
          header={formatMessage({ id: 'core.Restrictions', defaultMessage: 'Restrictions' })}
          key="25"
        >
          <DeviceRestrictions device_id={selectedDevice} />
        </Panel>
      ) : null}

      <Panel header={formatMessage({ id: 'core.Details', defaultMessage: 'Details' })} key="24">
        <ReactJson src={full_devices[selectedDevice].data} {...defaultProps} />
      </Panel>
    </Collapse>
  );
};

export default connect(({ kz_full_devices }) => ({
  full_devices: kz_full_devices,
}))(EditDevice);
