import React from 'react';
import ReactJson from 'react-json-view';
import { Modal } from 'antd';
import { reactJsonProps } from '../utils/props';

export default function funReactJson(info_details) {
  Modal.info({
    title: 'Details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={info_details} {...reactJsonProps} />,
    onOk() {},
  });
}

export const modalReactJson = (props) => {
  const { info_details } = props;
  return Modal.info({
    title: 'Details',
    width: 'max-content',
    maskClosable: true,
    content: <ReactJson src={info_details} {...reactJsonProps} />,
    onOk() {},
  });
};
