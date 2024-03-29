import React, { Fragment, useState, useEffect } from 'react';
import * as _ from 'lodash';
import { connect, useIntl } from 'umi';
import { Card, Switch } from 'antd';
import { kzUser } from '@/pages/onnet-portal/core/services/kazoo';
import { cardProps } from '@/pages/onnet-portal/core/utils/props';
import styles from '../style.less';

const ResellerUserMedia = (props) => {
  const [audioCodecs, setAudioCodecs] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  const { dispatch, child_account, child_full_users, owner_id } = props;

  useEffect(() => {
    if (child_full_users[owner_id]) {
      setAudioCodecs(_.get(child_full_users[owner_id].data, 'media.audio.codecs', []));
    }
    setIsLoading({});
  }, [child_full_users[owner_id]]);

  const { formatMessage } = useIntl();

  if (!child_full_users[owner_id]) return null;

  const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

  const onCodecChange = (checked, media, codec) => {
    setIsLoading({ [codec]: true });
    kzUser({
      method: 'GET',
      account_id: child_account.data?.id,
      owner_id,
    }).then((resp) => {
      const codecsList = _.get(resp, `data.media.${media}.codecs`, []);
      let newCodecsList = [];
      if (_.get(resp, `data.media.${media}.codecs`, []).includes(codec)) {
        newCodecsList = _.pull(codecsList, codec);
      } else {
        newCodecsList = _.concat(codecsList, codec);
      }
      const data = {};
      _.set(data, `media.${media}.codecs`, newCodecsList);
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
    });
  };

  return (
    <Fragment>
      <Card hoverable className={styles.card} {...cardProps}>
        <Card.Meta
          title={
            <Fragment>
              {formatMessage({
                id: 'core.Audio_codecs',
                defaultMessage: 'Audio codecs',
              })}
            </Fragment>
          }
          description={
            <>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="PCMA"
                  unCheckedChildren="PCMA"
                  checked={audioCodecs.includes('PCMA')}
                  onChange={(checked) => onCodecChange(checked, 'audio', 'PCMA')}
                  loading={isLoading.PCMA}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="PCMU"
                  unCheckedChildren="PCMU"
                  checked={audioCodecs.includes('PCMU')}
                  onChange={(checked) => onCodecChange(checked, 'audio', 'PCMU')}
                  loading={isLoading.PCMU}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="G722"
                  unCheckedChildren="G722"
                  checked={audioCodecs.includes('G722')}
                  onChange={(checked) => onCodecChange(checked, 'audio', 'G722')}
                  loading={isLoading.G722}
                />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <Switch
                  checkedChildren="OPUS"
                  unCheckedChildren="OPUS"
                  checked={audioCodecs.includes('OPUS')}
                  onChange={(checked) => onCodecChange(checked, 'audio', 'OPUS')}
                  loading={isLoading.OPUS}
                />
              </Card.Grid>
            </>
          }
        />
      </Card>
    </Fragment>
  );
};

export default connect(
  ({ kz_login, kz_account, kz_children, child_account, child_full_users }) => ({
    kz_login,
    kz_account,
    kz_children,
    child_account,
    child_full_users,
  }),
)(ResellerUserMedia);
