import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import * as _ from 'lodash';
import { Typography } from 'antd';
import { kzUser } from '../../services/kazoo';

const { Paragraph } = Typography;

const UserParagraph = props => {
  const [fieldContent, setFieldContent] = useState('Loading...');

  const { dispatch, account, full_users, owner_id, fieldKey } = props;

  useEffect(() => {
    if (full_users[owner_id]) {
      setFieldContent(_.get(full_users[owner_id].data, fieldKey));
    }
  }, [full_users[owner_id]]);

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
              account_id: account.data.id,
              owner_id,
              data,
            }).then(() =>
              dispatch({
                type: 'kz_full_users/refresh',
                payload: { account_id: account.data.id, owner_id },
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

export default connect(({ kz_account, kz_full_users }) => ({
  account: kz_account,
  full_users: kz_full_users,
}))(UserParagraph);
