import React, { useState } from 'react';
import { lbAccountDocsPDF } from '@/pages/onnet-portal/core/services/zzlb';
import download from 'downloadjs';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const LbDownloadDoc = props => {
  const [isLoading, setIsLoading] = useState(false);

  const { record, account_id } = props;

  const downloadDoc = rec => {
    setIsLoading(true);
    lbAccountDocsPDF({
      account_id,
      order_id: rec.order_id.toString(),
      period: rec.period.replace(/[^0-9]/g, ''),
    })
      .then(response => {
        download(response, `${rec.period}-${rec.order_id.toString()}-act.pdf`, 'application/pdf');
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <Button
      type="link"
      shape="circle"
      icon={<DownloadOutlined />}
      loading={isLoading}
      onClick={() => downloadDoc(record)}
    />
  );
};

export default LbDownloadDoc;
