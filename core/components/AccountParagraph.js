import React from 'react';
import { connect } from 'umi';
import { Typography } from 'antd';
import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { Paragraph } = Typography;

const AccountParagraph = props => {
  const { kz_account } = props;

  return (
    <Paragraph
      editable={{
        onChange: updatedText => {
          console.log(`updatedText ${updatedText}`);
          console.log(`props.currentText ${props.currentText}`);
          console.log(props.currentText !== updatedText);
          if (props.currentText !== updatedText) {
            runAndDispatch(kzAccount, 'kz_account/update', {
              method: 'PATCH',
              account_id: kz_account.data.id,
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

export default connect(({ kz_account }) => ({
  kz_account,
}))(AccountParagraph);
