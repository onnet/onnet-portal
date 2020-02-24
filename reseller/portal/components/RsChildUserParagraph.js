import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Typography } from 'antd';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { Paragraph } = Typography;

const RsChildUserParagraph = props => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const { dispatch, rs_child_account, rs_child_user, owner_id, fieldKey } = props;

  useEffect(() => {
    if (rs_child_user[owner_id]) {
      setFieldContent(rs_child_user[owner_id].data[fieldKey]);
    }
  }, [rs_child_user[owner_id]]);

  return (
    <Paragraph
      style={props.style}
      editable={{
        onChange: updatedText => {
          console.log(`updatedText ${updatedText}`);
          console.log(`fieldContent ${fieldContent}`);
          console.log(fieldContent !== updatedText);
          if (fieldContent !== updatedText) {
            kzUser({
              method: 'PATCH',
              account_id: rs_child_account.data.id,
              owner_id,
              data: { [fieldKey]: updatedText },
            }).then(() =>
              dispatch({
                type: 'rs_child_user/refresh',
                payload: { account_id: rs_child_account.data.id, owner_id },
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

export default connect(({ rs_child_account, rs_child_user }) => ({
  rs_child_account,
  rs_child_user,
}))(RsChildUserParagraph);
