import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import * as _ from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { useIntl, connect } from 'umi';
import { Drawer } from 'antd';
//import { AccountCdrLeg } from '@/pages/onnet-portal/telephony/services/kazoo-telephony';
import { reactJsonProps } from '@/pages/onnet-portal/core/utils/props';

const CallLegDrawer = (props) => {
  const [callLegData, setCallLegData] = useState({});

  const {
    settings,
    kz_account,
    selectedLeg,
    onSelectedLegDrawerClose,
    isSelectedLegDrawerVisible,
  } = props;

  const isSmallDevice = useMediaQuery({ maxWidth: 991 });
  const { formatMessage } = useIntl();

  //  useEffect(() => {
  //    if (kz_account.data && selectedAction.event_doc_id) setActionState();
  //  }, [kz_account, selectedAction]);
  //
  //  function setActionState() {
  //    setActionData({});
  //    AccountCdrLeg({
  //      account_id: kz_account.data.id,
  //      call: selectedCallLeg.id,
  //      method: 'GET',
  //    })
  //     .then((resp) => {
  //        console.log('AccountCdrLeg resp: ', resp);
  //        setCallLegData(resp.data);
  //      })
  //      .catch(() => console.log('Oops errors!'));
  //  }

  return (
    <Drawer
      title={
        selectedLeg ? (
          <>
            <b style={{ color: settings.primaryColor }}>
              {`${_.get(callLegData, 'container.cnt_name')}: `}
              {formatMessage({
                id: `.${selectedLeg.event_name}`,
                defaultMessage: selectedLeg.event_name,
              })}
            </b>
          </>
        ) : null
      }
      width={isSmallDevice ? '100%' : '70%'}
      placement="right"
      onClose={onSelectedLegDrawerClose}
      visible={isSelectedLegDrawerVisible}
    >
      <ReactJson src={selectedLeg} {...reactJsonProps} />
    </Drawer>
  );
};

export default connect(({ settings, kz_account }) => ({
  settings,
  kz_account,
}))(CallLegDrawer);
