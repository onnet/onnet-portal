import React from 'react';
import ReactJson from 'react-json-view';
import { useMediaQuery } from 'react-responsive';
import { connect } from 'umi';
import { Drawer } from 'antd';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';

const DetailsDrawer = (props) => {
  const { settings, details, title, onDetailsDrawerClose, isDetailsDrawerVisible } =
    props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });

  return (
    <Drawer
      title={
        details ? (
          <>
            <b style={{ color: settings.primaryColor }}>
              {title}
            </b>
          </>
        ) : null
      }
      width={isSmallDevice ? '100%' : '70%'}
      placement="right"
      onClose={onDetailsDrawerClose}
      visible={isDetailsDrawerVisible}
    >
      <ReactJson src={details} {...reactJsonProps} />
    </Drawer>
  );
};

export default connect(({ settings }) => ({
  settings,
}))(DetailsDrawer);
