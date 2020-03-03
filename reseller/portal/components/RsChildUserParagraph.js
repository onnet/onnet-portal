import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import * as _ from 'loadsh';
import { Typography } from 'antd';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { Paragraph } = Typography;

const RsChildUserParagraph = props => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const { dispatch, rs_child_account, rs_child_user, owner_id, fieldKey } = props;

  useEffect(() => {
    if (rs_child_user[owner_id]) {
      setFieldContent(_.get(rs_child_user[owner_id].data, fieldKey));
    }
  }, [rs_child_user[owner_id]]);

  return (
    <Paragraph
      style={props.style}
      editable={{
        onChange: updatedText => {
          if (fieldContent !== updatedText) {
            const data = {};
            _.set(data, fieldKey, updatedText);
            kzUser({
              method: 'PATCH',
              account_id: rs_child_account.data.id,
              owner_id,
              data,
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
