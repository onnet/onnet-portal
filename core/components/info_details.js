import React from 'react';
import ReactJson from 'react-json-view';
import { Modal } from 'antd';

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

export default function funReactJson(info_details) {
  Modal.info({
    title: 'Registration details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={info_details} {...defaultProps} />,
    onOk() {},
  });
}

export const modalReactJson = props => {
  const { info_details } = props;
  return Modal.info({
    title: 'Details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={info_details} {...defaultProps} />,
    onOk() {},
  });
};
