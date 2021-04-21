import React, { useState, Fragment } from 'react';
import download from 'downloadjs';
import { Table, Card, Button, message } from 'antd';

import { Form, Input } from 'formik-antd';
import { Formik } from 'formik';
import { createProformaInvoice, onbillsAttachment } from '@/pages/onnet-portal/core/services/zzapp';
import { useIntl } from 'umi';
import styles from '@/pages/onnet-portal/core/style.less';

const CardWireTransfer = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { account_id } = props;
  const { formatMessage } = useIntl();

  function validateNaN(value) {
    let error;
    if (Number.isNaN(value)) {
      console.log('Nice try!');
      message.error('Should be a number');
      error = 'Nice try!';
    }
    return error;
  }

  const tableData = [
    {
      key: '1',
      name: (
        <b>
          {formatMessage({
            id: 'reseller_portal.Issue_an_invoice',
            defaultMessage: 'Issue an invoice',
          })}
        </b>
      ),
    },
    {
      key: '2',
      name: (
        <Fragment>
          <Formik
            initialValues={{}}
            onSubmit={(values) => {
              console.log(values);
              setIsLoading(true);
              createProformaInvoice({
                account_id,
                data: {
                  amount: values.invoice_sum,
                },
              })
                .then((res) => {
                  console.log('createProformaInvoice res: ', res);
                  console.log('createProformaInvoice id: ', res.data.id);
                  onbillsAttachment({ account_id, doc_id: res.data.id }).then((att_res) => {
                    if (att_res.size > 0) {
                      download(att_res, `${res.data.id}.pdf`, 'application/pdf');
                      setIsLoading(false);
                    } else {
                      message.error('Something went wrong.');
                      setIsLoading(false);
                    }
                  });
                })
                .catch((error) => {
                  console.log(error);
                  setIsLoading(false);
                  message.error('Something went wrong.');
                });
            }}
          >
            {() => (
              <Form id="wiretransferform">
                <Input
                  name="invoice_sum"
                  type="text"
                  placeholder={formatMessage({
                    id: 'reseller_portal.Enter_an_amount_incl_VAT',
                    defaultMessage: 'Enter an amount, incl VAT',
                  })}
                  style={{ width: '217px', textAlign: 'center' }}
                  validate={validateNaN}
                />
              </Form>
            )}
          </Formik>
        </Fragment>
      ),
      value: (
        <Button
          type="primary"
          loading={isLoading}
          onClick={() =>
            document
              .getElementById('wiretransferform')
              .dispatchEvent(new Event('submit', { cancelable: true }))
          }
        >
          {formatMessage({
            id: 'reseller_portal.Generate_an_invoice',
            defaultMessage: 'Generate an invoice',
          })}
        </Button>
      ),
      align: 'center',
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, row, index) => {
        if (index === 0) {
          return {
            children: <a key={index}>{text}</a>,
            props: {
              colSpan: 2,
            },
          };
        }
        return {
          children: <a key={index}>{text}</a>,
          props: {
            align: 'center',
            width: '50%',
          },
        };
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, row, index) => {
        if (index === 0) {
          return {
            children: <a key={index}>{text}</a>,
            props: {
              colSpan: 0,
            },
          };
        }
        return {
          children: <a key={index}>{text}</a>,
          props: {
            align: 'left',
          },
        };
      },
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        title={formatMessage({
          id: 'reseller_portal.Wiretransfer',
          defaultMessage: 'Wire transfer',
        })}
        description={
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            showHeader={false}
            size="small"
          />
        }
      />
    </Card>
  );
};

export default CardWireTransfer;
