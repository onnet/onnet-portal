import React from 'react';
import { connect } from 'dva';
import { Typography } from 'antd';
import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { Paragraph } = Typography;

const RsChildAccountParagraph = props => {
  const { rs_child_account } = props;

  return (
    <Paragraph
      style={props.style}
      editable={{
        onChange: updatedText => {
          console.log(`updatedText ${updatedText}`);
          console.log(`props.currentText ${props.currentText}`);
          console.log(props.currentText !== updatedText);
          if (props.currentText !== updatedText) {
            runAndDispatch(kzAccount, 'rs_child_account/update', {
              method: 'PATCH',
              account_id: rs_child_account.data.id,
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

export default connect(({ rs_child_account }) => ({
  rs_child_account,
}))(RsChildAccountParagraph);
