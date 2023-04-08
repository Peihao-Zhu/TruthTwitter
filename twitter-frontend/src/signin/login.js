import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import './login.css'
import * as actions from '../action/action'
import { connect } from 'react-redux'

function LoginPage(props) {
  const onFinish = (values) => {
    props.signin(values.username, values.password)
  }
  return (
    <div>
      {props.error === null ? null : (
        <p className="errorMessage">{props.error}</p>
      )}
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">sign up now!</a>
        </Form.Item>
      </Form>
    </div>
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
    signin: (username, password) =>
      dispatch(actions.signin(username, password)),
    onResetError: () => dispatch({ type: 'RESET_ERROR' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
