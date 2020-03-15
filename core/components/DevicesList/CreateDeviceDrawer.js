import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, DatePicker } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { Option } = Select;

const CreateDeviceDrawer = props => {
  const { formRef } = props;

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      layout="vertical"
      hideRequiredMark
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      ref={formRef}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Please enter user name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="url"
            label="Url"
            rules={[{ required: true, message: 'Please enter url' }]}
          >
            <Input
              style={{ width: '100%' }}
              addonBefore="http://"
              addonAfter=".com"
              placeholder="Please enter url"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="owner"
            label="Owner"
            rules={[{ required: true, message: 'Please select an owner' }]}
          >
            <Select placeholder="Please select an owner">
              <Select.Option value="xiao">Xiaoxiao Fu</Select.Option>
              <Select.Option value="mao">Maomao Zhou</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please choose the type' }]}
          >
            <Select placeholder="Please choose the type">
              <Option value="private">Private</Option>
              <Option value="public">Public</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="approver"
            label="Approver"
            rules={[{ required: true, message: 'Please choose the approver' }]}
          >
            <Select placeholder="Please choose the approver">
              <Option value="jack">Jack Ma</Option>
              <Option value="tom">Tom Liu</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dateTime"
            label="DateTime"
            rules={[{ required: true, message: 'Please choose the dateTime' }]}
          >
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'please enter url description',
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="please enter url description" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default connect(({ kz_full_devices }) => ({
  full_devices: kz_full_devices,
}))(CreateDeviceDrawer);
