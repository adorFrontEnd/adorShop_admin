import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { baseRoute, routerConfig } from '../../config/router.config';
import { sendSms, forgetPassword } from '../../api/oper/login';
import { getCacheAccountList, setCacheAccountList, getCacheUserInfo } from '../../middleware/localStorage/login';
import './index.less';
import './pwd.less';
import { apiUrlPrefix } from '../../config/http.config';
import Toast from "../../utils/toast";

class Page extends Component {

  state = {
    showVefifyClickLinkStatus: "0",
    countNum: 60
  }

  componentDidMount() {
    document.title = '爱朵电商 | 总后台';
    this.imageChange();
    this.resetCdTimer();
  }

  goback = () => {
    window.history.back();
  }





  usernameOnBlur = (e) => {
    let newusername = e.target.value;
    if (this.state.username != newusername) {
      this.setState({
        username: newusername
      })
      this.imageChange();
    }
  }
  onLoginChange = (e, key) => {
    let data = {};
    data[key] = e.currentTarget.value
    this.props.form.setFieldsValue(data);
    this.setState(data)
  }



  imageChange = () => {
    this.setState({
      now: Date.now()
    })
  }


  sendSms = () => {
    let params = this.props.form.getFieldsValue();
    let { username } = params;
    sendSms({ phone: username })
      .then(() => {
        Toast("发送短信成功！");
        this.startCdTimer();
      })
  }
  verfyCodeClicked = () => {
    this.setState({
      showVerifySlider: true
    })
  }

  onPhoneChange = (e) => {
    let phone = e.currentTarget.value;
    let showVefifyClickLinkStatus = (phone && phone.length == 11) ? "1" : "0";
    this.setState({
      showVefifyClickLinkStatus
    })
  }

  startCdTimer = () => {
    this.resetCdTimer();
    let cdTimer = setInterval(() => {
      let countNum = this.state.countNum;
      countNum--;
      this.setState({
        countNum
      })
      if (countNum <= 0) {
        this.resetCdTimer();
      }
    }, 1000)
    this.setState({
      cdTimer
    })
  }

  resetCdTimer = () => {
    let cdTimer = this.state.cdTimer;
    if (this.state.cdTimer) {
      clearInterval(this.state.cdTimer);
      this.setState({
        cdTimer: null
      })
    }
    this.setState({
      countNum: 60
    })
  }

  submitPassword = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { phone, code, password } = data;
      forgetPassword({ phone, code, password })
        .then(() => {
          Toast('重置密码成功！');
          window.location.href = '/login';
        })
    })

  }
  // 登录
  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, userInfo) => {
      if (err) {
        return;
      }

      let username = userInfo.username;
      let password = userInfo.password;
      let imageCode = userInfo.imageCode;
      forgetPassword(userInfo).then(data => {
        Toast("重置成功！");
        if (this.state.redirectLogin) {
          this.props.history.push(routerConfig['login'].path);
          return;
        }
        setTimeout(() => {
          this.setState({
            showBtnLoading: false
          })
          this.props.history.push(routerConfig['shop.shopAuth'].path);
        }, 1000)

      })

    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "700px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", position: 'relative' }}>
            <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
            <div className='login-form-title'>爱朵电商</div>
            <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
              总平台
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>忘记密码</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: "space-between", padding: '20px 4px' }}>
          <div style={{ padding: '20px 4px' }}>

            <Form theme='dark' className='login-form' style={{ width: 450 }}>

              <Form.Item className="radius-input">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入账号!' }],
                })(
                  <Input
                    onBlur={this.usernameOnBlur}
                    onChange={(e) => { this.onLoginChange(e, 'username') }}
                    placeholder="请填写后台账号"
                  />
                )}
              </Form.Item>
              <Form.Item className="radius-input">
                {
                  getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '请输入密码!' }
                    ],
                  })(
                    <Input
                      onChange={(e) => { this.onLoginChange(e, 'password') }}
                      type="password" placeholder="请填写重置密码"
                    />
                  )
                }
              </Form.Item>
              <div className="image-code">
                <Form.Item className='qrcode-input'>
                  {getFieldDecorator('verifyCode', {
                    rules: [
                      { required: true, message: '请输入验证码!' },
                      {
                        pattern: new RegExp('^[0-9a-zA-Z]{4}$', 'g'),
                        message: '请输入正确的验证码'
                      }
                    ],
                  })(
                    <Input

                      onChange={(e) => { this.onLoginChange(e, 'verifyCode') }}
                      maxLength={4} type="text" placeholder="填写验证码"
                    />
                  )}
                </Form.Item>
                <div className='img-wraper'>
                  <img
                    style={{ "cursor": "pointer" }}
                    onClick={this.imageChange}
                    src={apiUrlPrefix + "imageCaptcha?username=" + this.state.username + "&stamp=" + this.state.now}
                  />
                </div>

              </div>
              <Button
                loading={this.props.loading}
                type="primary"
                htmlType="submit"
                onClick={this.sendSms}
                className="login-form-button yellow-btn">
                发送短信
              </Button>
              <Form.Item className='qrcode-input'>
                {getFieldDecorator('smsCode', {
                  rules: [
                    { required: true, message: '请输入验证码!' },
                    {
                      pattern: new RegExp("^[0-9]{6}$", 'g'),
                      message: '请输入正确的验证码'
                    }
                  ],
                })(
                  <Input

                    onChange={(e) => { this.onLoginChange(e, 'smsCode') }}
                    // prefix={<Icon type="safety-certificate" theme="filled" style={{ color: "#999999" }} />}
                    maxLength={6} type="text" placeholder="填写6位短信验证码"
                  />
                )}
              </Form.Item>
              <Button
                loading={this.props.loading}
                type="primary"
                htmlType="submit"
                onClick={this.handleSubmit}
                className="login-form-button yellow-btn">
                确认重置
              </Button>
            </Form>
          </div>
          <div style={{ width: "45%", marginLeft: "12px" }}>
            <img src='/image/bg.png' style={{ maxWidth: "100%" }} />
          </div>
        </div>

      </div >
    )
  }
}
export default Form.create()(Page)


