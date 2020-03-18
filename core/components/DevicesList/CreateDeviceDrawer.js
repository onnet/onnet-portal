import React from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Tabs } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

const { TabPane } = Tabs;

const CreateDeviceDrawer = props => {
  const {
    setCreateDeviceType,
    formRef_sip_device,
    formRef_sip_uri,
    formRef_cell_phone,
    onFinish,
  } = props;

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const inputStyle = { maxWidth: '100%' };

  function callback(key) {
    console.log(key);
    setCreateDeviceType(key);
  }

  return (
    <Tabs defaultActiveKey="sip_device" onChange={callback}>
      <TabPane tab="SIP Device" key="sip_device">
        <Form
          name="form_name"
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={formRef_sip_device}
          initialValues={{ device_type: 'sip_device' }}
        >
          <Form.Item name="device_type" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12} offset={6}>
              <Form.Item
                name="sip_device_nickname"
                label="Device nickname"
                rules={[
                  {
                    required: true,
                    message: 'Please input device nickname!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  style={inputStyle}
                  placeholder={formatMessage({ id: 'core.Nickname', defaultMessage: 'Nickname' })}
                />
              </Form.Item>
            </Col>
            <Col span={12} offset={6}>
              <Form.Item
                name="sip_device_username"
                label="Device username"
                rules={[
                  {
                    required: true,
                    message: 'Please input device username!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  style={inputStyle}
                  placeholder={formatMessage({ id: 'core.Username', defaultMessage: 'Username' })}
                />
              </Form.Item>
            </Col>
            <Col span={12} offset={6}>
              <Form.Item
                name="sip_device_pasword"
                label="Device password"
                rules={[
                  {
                    required: true,
                    message: 'Please input device password!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  style={inputStyle}
                  placeholder={formatMessage({ id: 'core.Password', defaultMessage: 'Password' })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="Cell Phone" key="cell_phone">
        <Form
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={formRef_cell_phone}
          initialValues={{ device_type: 'cell_phone' }}
        >
          <Form.Item name="device_type" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12} offset={6}>
              <Form.Item
                name="device_nickname"
                label="Device nickname"
                rules={[
                  {
                    required: true,
                    message: 'Please input device nickname!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  style={inputStyle}
                  placeholder={formatMessage({ id: 'core.Nickname', defaultMessage: 'Nickname' })}
                />
              </Form.Item>
            </Col>
            <Col span={12} offset={6}>
              <Form.Item
                name="redirect_number"
                label="Phone number"
                rules={[
                  {
                    required: true,
                    message: 'Please input number to redirect!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  style={inputStyle}
                  placeholder={formatMessage({
                    id: 'core.Phone_number',
                    defaultMessage: 'Phone number',
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </TabPane>
      <TabPane tab="SIP URI" key="sip_uri">
        <Form
          name="form_sip_uri"
          layout="vertical"
          hideRequiredMark
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={formRef_sip_uri}
          initialValues={{ device_type: 'sip_uri' }}
        >
          <Form.Item name="device_type" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
        </Form>
      </TabPane>
    </Tabs>
  );
};

export default connect(({ kz_full_devices }) => ({
  full_devices: kz_full_devices,
}))(CreateDeviceDrawer);
