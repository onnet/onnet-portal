import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, Button, DatePicker } from 'antd';
import styles from '../style.less';

import CardProforma from './CardProforma';
import CardActs from './CardActs';
import CardVatInvoices from './CardVatInvoices';
import CardCallsReports from './CardCallsReports';

const { MonthPicker } = DatePicker;

const monthFormat = 'YYYY/MM';

const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  xxl: 12,
};

const CardProps = {
  style: { marginBottom: 24 },
};

const LbFinanceDetails = props => {
  const { dispatch, lb_documents, kazoo_account } = props;

  const [selectedMonth, setSelectedMonth] = useState(
    moment()
      .subtract(1, 'months')
      .format('MM'),
  );
  const [selectedYear, setSelectedYear] = useState(
    moment()
      .subtract(1, 'months')
      .format('YYYY'),
  );

  useEffect(() => {
    if (kazoo_account.data) {
      dispatch({
        type: 'lb_documents/refresh',
        payload: {
          method: 'POST',
          account_id: kazoo_account.data.id,
          data: { year: selectedYear, month: selectedMonth },
        },
      });
    }
  }, [kazoo_account]);

  const extraContent = (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <p>{formatMessage({ id: 'reseller_portal.Period', defaultMessage: 'Period' })}</p>
        <MonthPicker
          defaultValue={moment(`${selectedYear}/${selectedMonth}`, monthFormat)}
          format={monthFormat}
          allowClear={false}
          onChange={date => {
            setSelectedMonth(date.format('MM'));
            setSelectedYear(date.format('YYYY'));
            dispatch({
              type: 'lb_documents/refresh',
              payload: {
                method: 'POST',
                account_id: kazoo_account.data.id,
                data: { year: date.format('YYYY'), month: date.format('MM') },
              },
            });
          }}
        />
      </div>
      <div className={styles.statItem} style={{ textAlign: 'center' }}>
        <p>
          {formatMessage({ id: 'reseller_portal.Calls_report', defaultMessage: 'Calls report' })}
        </p>
        <Button type="primary" onClick={() => console.log('Calls report button clicked')}>
          {formatMessage({
            id: 'reseller_portal.Generate_report',
            defaultMessage: 'Generate report',
          })}
        </Button>
      </div>
    </div>
  );

  return (
    <PageHeaderWrapper extra={extraContent}>
      {lb_documents ? (
        lb_documents.data ? (
          <Fragment>
            <Row gutter={24}>
              <Col key="colkey11" {...topColResponsiveProps}>
                {lb_documents.data.proformas.length > 0 ? (
                  <CardProforma
                    {...CardProps}
                    proformas={lb_documents.data.proformas}
                    account_id={lb_documents.data.account_id}
                  />
                ) : null}
                {lb_documents.data.proformas.length > 0 ? (
                  <CardVatInvoices
                    {...CardProps}
                    proformas={lb_documents.data.vat_invoices}
                    account_id={lb_documents.data.account_id}
                  />
                ) : null}
                {lb_documents.data.proformas.length > 0 ? (
                  <CardActs
                    {...CardProps}
                    proformas={lb_documents.data.acts}
                    account_id={lb_documents.data.account_id}
                  />
                ) : null}
                {lb_documents.data.calls_reports_pdf.length > 0 ? (
                  <CardCallsReports
                    {...CardProps}
                    calls_reports_pdf={lb_documents.data.calls_reports_pdf}
                    account_id={lb_documents.data.account_id}
                  />
                ) : null}
              </Col>
            </Row>
          </Fragment>
        ) : null
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ lb_documents, kazoo_account }) => ({
  lb_documents,
  kazoo_account,
}))(LbFinanceDetails);
