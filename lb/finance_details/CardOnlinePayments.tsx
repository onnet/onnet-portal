import React, { Fragment } from 'react';
import { Table, Card, Button, message } from 'antd';
import { Form, Input } from 'formik-antd';
import { Formik } from 'formik';

import { useIntl } from 'umi';

import { yandexMoneyPayment } from '@/pages/onnet-portal/core/services/zzapp';

import styles from '@/pages/onnet-portal/core/style.less';

function validateNaN(value) {
  let error;
  if (Number.isNaN(value)) {
    console.log('Nice try!');
    message.error('Should be a number');
    error = 'Nice try!';
  }
  return error;
}

const CardOnlinePayments = (props) => {
  const { lb_account, account_id } = props;
  const { formatMessage } = useIntl();

  const tableDataDengiOnline = [
    {
      key: '1',
      name: (
        <b>
          {formatMessage({
            id: 'reseller_portal.DengiOnlineEPS',
            defaultMessage: 'Dengi Online - Electronic Payment System',
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
            }}
          >
            {({ errors, touched }) => (
              <Form id="dengionlineform">
                <Input
                  name="transfer_sum"
                  type="text"
                  placeholder={formatMessage({
                    id: 'reseller_portal.Enter_an_amount_to_pay',
                    defaultMessage: 'Enter an amount to pay',
                  })}
                  style={{ width: '217px', textAlign: 'center' }}
                  validate={validateNaN}
                />
                {errors.username && touched.username && <div>{errors.username}</div>}
              </Form>
            )}
          </Formik>
        </Fragment>
      ),
      value: (
        <Button
          type="primary"
          onClick={() =>
            document
              .getElementById('dengionlineform')
              .dispatchEvent(new Event('submit', { cancelable: true }))
          }
        >
          {formatMessage({
            id: 'reseller_portal.PaywithDengiOnline',
            defaultMessage: 'Pay with DengiOnline',
          })}
        </Button>
      ),
      align: 'center',
    },
  ];

  const tableDataYandexMoney = [
    {
      key: '1',
      name: (
        <b>
          {formatMessage({
            id: 'reseller_portal.YandexMoneyEPS',
            defaultMessage: 'Yandex.Money - Electronic Payment System',
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
              yandexMoneyPayment({
                account_id,
                data: {
                  sum: values.transfer_sum,
                  agrm_id: encodeURIComponent(
                    `${lb_account.data.main_agrm.agrm_num} ${lb_account.data.main_agrm.agrm_date}`,
                  ),
                },
              }).then((res) => {
                console.log('yandexMoneyPayment: ', res.data.payment_url);
                window.location.href = res.data.payment_url;
              });
            }}
          >
            {({ errors, touched }) => (
              <Form id="yandexmoneyform">
                <Input
                  name="transfer_sum"
                  type="text"
                  placeholder={formatMessage({
                    id: 'reseller_portal.Enter_an_amount_to_pay',
                    defaultMessage: 'Enter an amount to pay',
                  })}
                  style={{ width: '217px', textAlign: 'center' }}
                  validate={validateNaN}
                />
                {errors.username && touched.username && <div>{errors.username}</div>}
              </Form>
            )}
          </Formik>
        </Fragment>
      ),
      value: (
        <Button
          type="primary"
          onClick={() =>
            document
              .getElementById('yandexmoneyform')
              .dispatchEvent(new Event('submit', { cancelable: true }))
          }
        >
          {formatMessage({
            id: 'reseller_portal.PaywithYandexMoney',
            defaultMessage: 'Pay with Yandex.Money',
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
            //      align: 'center',
          },
        };
      },
    },
  ];

  return (
    <Card className={styles.card} {...props}>
      <Card.Meta
        title={formatMessage({
          id: 'reseller_portal.Onlinepayments',
          defaultMessage: 'Online payments',
        })}
        description={
          <Fragment>
            <Table
              dataSource={tableDataDengiOnline}
              columns={columns}
              pagination={false}
              showHeader={false}
              size="small"
              style={{ display: 'none' }}
            />
            <br />
            <Table
              dataSource={tableDataYandexMoney}
              columns={columns}
              pagination={false}
              showHeader={false}
              size="small"
            />
          </Fragment>
        }
      />
    </Card>
  );
};

export default CardOnlinePayments;
