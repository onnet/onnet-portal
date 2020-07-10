import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import * as _ from 'lodash';
import { Typography } from 'antd';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';

const { Paragraph } = Typography;

const RsChildUserParagraph = (props) => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const { dispatch, child_account, child_full_users, owner_id, fieldKey } = props;

  useEffect(() => {
    if (child_full_users[owner_id]) {
      setFieldContent(_.get(child_full_users[owner_id].data, fieldKey));
    }
  }, [child_full_users[owner_id]]);

  return (
    <Paragraph
      style={props.style}
      editable={{
        onChange: (updatedText) => {
          if (fieldContent !== updatedText) {
            const data = {};
            _.set(data, fieldKey, updatedText);
            kzUser({
              method: 'PATCH',
              account_id: child_account.data?.id,
              owner_id,
              data,
            }).then(() =>
              dispatch({
                type: 'child_full_users/refresh',
                payload: { account_id: child_account.data?.id, owner_id },
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

export default connect(({ child_account, child_full_users }) => ({
  child_account,
  child_full_users,
}))(RsChildUserParagraph);
