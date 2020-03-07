import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';
import { Typography } from 'antd';
import { kzAccount } from '@/pages/onnet-portal/core/services/kazoo';
import { runAndDispatch } from '@/pages/onnet-portal/core/utils/subroutine';

const { Paragraph } = Typography;

const RsChildAccountParagraph = props => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const { child_account } = props;

  useEffect(() => {
    if (child_account.data) {
      setFieldContent(child_account.data[props.fieldKey]);
    }
  }, [child_account]);

  return (
    <Paragraph
      style={props.style}
      editable={{
        onChange: updatedText => {
          if (fieldContent !== updatedText) {
            const data = {};
            _.set(data, props.fieldKey, updatedText);
            runAndDispatch(kzAccount, 'child_account/update', {
              method: 'PATCH',
              account_id: child_account.data.id,
              //            data: { [props.fieldKey]: updatedText },
              data,
            });
          }
        },
      }}
    >
      {fieldContent}
    </Paragraph>
  );
};

export default connect(({ child_account }) => ({
  child_account,
}))(RsChildAccountParagraph);
