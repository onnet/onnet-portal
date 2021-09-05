import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { connect } from 'umi';
import { Tag } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CallflowBuilder = (props) => {
  const { kz_account } = props;

  return (
    <PageHeaderWrapper breadcrumb={false}>
      <div id="treeWrapper" style={{ width: '100em', height: '100em' }}></div>
    </PageHeaderWrapper>
  );
};

export default connect(({ kz_account }) => ({
  kz_account,
}))(CallflowBuilder);
