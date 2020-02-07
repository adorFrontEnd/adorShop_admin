import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { baseRoute, routerConfig } from '../../config/router.config';
import { sendSms, forgetPassword } from '../../api/oper/login';
import './index.less';
import './pwd.less';
import { apiUrlPrefix } from '../../config/http.config';
import Toast from "../../utils/toast";

class Page extends Component {

  state = {
    showBtnLoading: false,
    showVerifySlider: false,
    beginClientX: 0,
    /*距离屏幕左端距离*/
    mouseMoveStata: false,
    maxwidth: 360,
    confirmWords: '按住滑块向右拖动验证登录',
    /*滑块文字*/
    confirmSuccess: false,
    left: '0',
    width: '0',
    comfirmbg: 'image/slider.png',
    showVefifyClickLinkStatus: "0",
    countNum: 60
  }

  componentDidMount() {
    document.title = '爱朵电商 | 总后台'
  }

  goback = () => {
    window.history.back();
  }

  componentDidMount() {
    document.body.addEventListener('mousemove', this.mousemoveEvent);
    document.body.addEventListener('mouseup', this.mouseupEvent)
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.mousemoveEvent);
    document.body.removeEventListener('mouseup', this.mouseupEvent);
    this.resetCdTimer();
  }


  mouseupEvent = (e) => {
    //鼠标放开 
    this.setState({
      mouseMoveStata: false
    })
    var width = e.clientX - this.state.beginClientX;
    if (width < this.state.maxwidth) {
      this.setState({
        left: '0',
        width: '0'
      })
    }
  }

  mousemoveEvent = (e) => {
    if (this.state.mouseMoveStata) {
      var width = e.clientX - this.state.beginClientX;

      if (width > 0 && width <= this.state.maxwidth) {
        this.setState({
          left: width,
          width
        })
      } else if (width > this.state.maxwidth) {
        this.successFunction()
      }
    }
  }


  mousedownFn = (e) => {
    this.setState({
      mouseMoveStata: true,
      beginClientX: e.clientX
    })
  }

  successFunction = () => {
    this.setState({
      confirmWords: "验证通过",
      left: this.state.maxwidth,
      width: this.state.maxwidth,
      comfirmbg: "/image/confirm.png",
      confirmSuccess: true
    })
    setTimeout(() => {

      if (this.state.confirmSuccess) {
        this.setState({
          showVerifySlider: false,
          confirmWords: "按住滑块向右拖动验证登录",
          comfirmbg: 'image/slider.png',
          confirmSuccess: false
        })
        let params = this.props.form.getFieldsValue();
        let { phone } = params;
        sendSms({ phone })
          .then(() => {
            Toast("发送短信成功！");
            this.startCdTimer();
          })
      }
    }, 1000);
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
                    // prefix={<Icon type="user" style={{ color: "#999999" }} />}
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
                      // prefix={<Icon type="lock" theme="filled" style={{ color: "#999999" }} />}
                      type="password" placeholder="请填写重置密码"
                    />
                  )
                }
              </Form.Item>
              <div className="image-code">
                <Form.Item className='qrcode-input'>
                  {getFieldDecorator('imageCode', {
                    rules: [
                      { required: true, message: '请输入验证码!' },
                      {
                        pattern: new RegExp('^[0-9a-zA-Z]{4}$', 'g'),
                        message: '请输入正确的验证码'
                      }
                    ],
                  })(
                    <Input

                      onChange={(e) => { this.onLoginChange(e, 'imageCode') }}
                      // prefix={<Icon type="safety-certificate" theme="filled" style={{ color: "#999999" }} />}
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
                className="login-form-button yellow-btn">
                发送短信
              </Button>
              <Form.Item className='qrcode-input'>
                {getFieldDecorator('imageCode', {
                  rules: [
                    { required: true, message: '请输入验证码!' },
                    {
                      pattern: new RegExp('^[0-9a-zA-Z]{4}$', 'g'),
                      message: '请输入正确的验证码'
                    }
                  ],
                })(
                  <Input

                    onChange={(e) => { this.onLoginChange(e, 'imageCode') }}
                    // prefix={<Icon type="safety-certificate" theme="filled" style={{ color: "#999999" }} />}
                    maxLength={4} type="text" placeholder="填写6位短信验证码"
                  />
                )}
              </Form.Item>
              <Button
                loading={this.props.loading}
                type="primary"
                htmlType="submit"
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


