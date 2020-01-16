import React, { Component } from 'react';
import { Card, Button, Icon, Table, Input } from 'antd';
import Moment from 'react-moment';
import 'moment-timezone';
import MoneyFormat from '@/pages/onnet-portal/core/components/MoneyFormat';
import Highlighter from 'react-highlight-words';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from '@/pages/onnet-portal/core/style.less';

class CardCDR extends Component {
  state = {
    searchText: '',
    currentTableLength: 0,
    currentFilter: {},
  };

  componentDidUpdate(prevProps) {
    if (prevProps.lb_statistics.request_id !== this.props.lb_statistics.request_id) {
      const { cdrs } = this.props.lb_statistics.data;
      if (cdrs) {
        const currTL = cdrs.length;
        const totalMinutes = cdrs.reduce((acc, call) => acc + parseInt(call.duration, 10), 0);
        console.log('componentDidUpdate totalMinutes: ', totalMinutes);
        const totalAmount = cdrs.reduce((acc, call) => acc + parseFloat(call.amount), 0.0);
        console.log('componentDidUpdate totalAmount: ', totalAmount);
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          currentTableLength: currTL,
          currentFilter: {},
          searchText: '',
          totalAmount,
          totalMinutes,
        });
        console.log('onentDidUpdate this.state: ', this.state);
      }
    }
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  countSelectedRows = () => `Selected rows amount: ${this.state.currentTableLength}`;

  render() {
    let { currentFilter } = this.state;
    currentFilter = currentFilter || {};

    const { lb_statistics, pagination } = this.props;

    const columns = [
      {
        title: formatMessage({ id: 'reseller_portal.Start_time', defaultMessage: 'Start time' }),
        dataIndex: 'timefrom',
        render: text => <Moment format="YYYY-MM-DD HH:mm:ss">{text}</Moment>,
        key: 'timefrom',
      },
      {
        title: formatMessage({ id: 'reseller_portal.Caller', defaultMessage: 'Caller' }),
        dataIndex: 'numfrom',
        filteredValue: currentFilter.numfrom || '',
        key: 'numfrom',
        align: 'center',
        ...this.getColumnSearchProps('numfrom'),
      },
      {
        title: formatMessage({ id: 'reseller_portal.Callee', defaultMessage: 'Callee' }),
        dataIndex: 'numto',
        filteredValue: currentFilter.numto || '',
        key: 'numto',
        align: 'center',
        ...this.getColumnSearchProps('numto'),
      },
      {
        title: formatMessage({ id: 'reseller_portal.Min', defaultMessage: 'Min' }),
        dataIndex: 'duration',
        key: 'duration',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'reseller_portal.Rub', defaultMessage: 'Rub' }),
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
      },
    ];

    const footer = () => (
      <div style={{ width: '100%' }}>
        <div style={{ paddingRight: '1em', display: 'inline' }}>
          {formatMessage({ id: 'reseller_portal.Total_calls', defaultMessage: 'Total calls' })}:{' '}
          {this.state.currentTableLength}
        </div>
        <div style={{ paddingRight: '0.5em', float: 'right', display: 'inline' }}>
          <MoneyFormat amount={this.state.totalAmount} />
        </div>
        <div style={{ paddingRight: '1em', float: 'right', display: 'inline' }}>
          {this.state.totalMinutes}{' '}
          {formatMessage({ id: 'reseller_portal.minutes_short', defaultMessage: 'min.' })}
        </div>
        <div style={{ paddingRight: '1em', float: 'right', display: 'inline' }}>
          {formatMessage({
            id: 'reseller_portal.Total_all_pages',
            defaultMessage: 'Total (all pages)',
          })}
          :
        </div>
      </div>
    );

    return (
      <Card className={styles.card}>
        <Card.Meta
          avatar={
            <img
              alt=""
              className={styles.cardAvatar}
              src="https://api.adorable.io/avatars/24/CardCDR.png"
            />
          }
          title={formatMessage({
            id: 'reseller_portal.Calls_report',
            defaultMessage: 'Calls report',
          })}
          description={
            <Table
              bordered
              dataSource={lb_statistics.data ? lb_statistics.data.cdrs : []}
              columns={columns}
              pagination={pagination}
              loading={lb_statistics.is_loading}
              size="small"
              rowKey={record =>
                record.timefrom.toString().replace(/[^A-Za-z0-9]/g, '') +
                record.numfrom.toString().replace(/[^A-Za-z0-9]/g, '') +
                record.numto.toString().replace(/[^A-Za-z0-9]/g, '')
              }
              onRow={(record, rowIndex) => ({
                onClick: event => {
                  console.log('Clicked row event: ', event);
                  console.log('Clicked row rowIndex: ', rowIndex);
                  console.log('Clicked row record: ', record);
                },
              })}
              onChange={(filter, sorter, { currentDataSource }) => {
                const totalMinutes = currentDataSource.reduce(
                  (acc, call) => acc + parseInt(call.duration, 10),
                  0,
                );
                console.log('onChange totalMinutes: ', totalMinutes);
                const totalAmount = currentDataSource.reduce(
                  (acc, call) => acc + parseFloat(call.amount),
                  0.0,
                );
                console.log('onChange totalAmount: ', totalAmount);
                console.log('onChange sorter: ', sorter);
                this.setState({
                  currentTableLength: currentDataSource.length,
                  currentFilter: filter,
                  totalAmount,
                  totalMinutes,
                });
              }}
              footer={footer}
              style={{ backgroundColor: 'white' }}
            />
          }
        />
      </Card>
    );
  }
}

export default CardCDR;
