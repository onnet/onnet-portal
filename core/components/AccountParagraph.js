import React from 'react';
import { connect } from 'dva';
import { Typography } from 'antd';
import { runAndDispatch } from '@/pages/onnet-portal/core/services/kazoo';

const { Paragraph } = Typography;

const AccountParagraph = props => {
  const { kazoo_account } = props;

  return (
    <Paragraph
      editable={{
        onChange: updatedText => {
          console.log(`updatedText ${updatedText}`);
          console.log(`props.currentText ${props.currentText}`);
          console.log(props.currentText !== updatedText);
          if (props.currentText !== updatedText) {
            runAndDispatch('kzAccount', 'kazoo_account/update', {
              method: 'PATCH',
              account_id: kazoo_account.data.id,
              data: { [props.fieldKey]: updatedText },
            });
          }
        },
      }}
    >
      {props.currentText}
    </Paragraph>
  );
};

export default connect(({ kazoo_account }) => ({
  kazoo_account,
}))(AccountParagraph);
