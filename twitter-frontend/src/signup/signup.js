import { Button, Form, Input, Select } from 'antd'
import './signup.css'
import { connect } from 'react-redux'
import * as actions from '../action/action'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

function Signup(props) {
  const [form] = Form.useForm()
  const onFinish = (values) => {
    props.signup(values)
  }
  // const prefixSelector = (
  //   <Form.Item name="prefix" noStyle>
  //     <Select className="selector">
  //       <Option value="1">+1</Option>
  //       {/* <Option value="86">+86</Option> */}
  //     </Select>
  //   </Form.Item>
  // )

  return (
    <Form
      className="signup-form"
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: '1',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match!'),
              )
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="nickname"
        label="Nickname"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="bio"
        label="Bio"
        rules={[
          {
            message: 'About me',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="website"
        label="Website"
        rules={[
          {
            message: 'Please input your website!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input addonBefore={prefixSelector} className="phone-number-input" />
      </Form.Item> */}

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
const mapStateToProps = (state) => {
  return {
    error: state.error,
    loading: state.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (data) => dispatch(actions.signup(data)),
    onResetError: () => dispatch({ type: 'RESET_ERROR' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
