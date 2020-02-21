import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { apiUrlPrefix } from '../../config/http.config';
import Toast from '../../utils/toast';
// import ImageCode from "../../components/imageCode/imageCode";
import './login.less'
let isPending = false;
const FormItem = Form.Item;

class NormalLoginForm extends Component {

  constructor() {
    super();
    this.canvas = React.createRef();
  }
  state = {
    isShow: false,
    imageUrl: "",
    username: "",
    password: "",
    imageCode: "",
    url: "http://pic1.win4000.com/wallpaper/2019-07-23/5d36c98e443d8.jpg",
    beginClientX: 0,
    /*距离屏幕左端距离*/
    mouseMoveStata: false,
    maxwidth: 270,
    confirmWords: '按住滑块向右拖动验证登录',
    /*滑块文字*/
    confirmSuccess: false,
    left: '0',
    width: '0',
    comfirmbg: 'image/slider.png'
    // comfirmbg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg=="
  }


  componentDidMount() {
    this.imageChange()
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
      this.props.login({ username, password, imageCode });
    });
  }

  imageChange = () => {
    this.setState({
      now: Date.now()
    })
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
  forgotPassword = (e) => {
    e.preventDefault();
    Toast('请联系管理员找回密码！')
  }

  onLoginChange = (e, key) => {
    let data = {};
    data[key] = e.currentTarget.value
    this.props.form.setFieldsValue(data);
    this.setState(data)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form theme='dark' onSubmit={this.handleSubmit} className="login-form" style={{ width: 450, height: "100%" }}>

        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: '请输入账号!' },
              { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确的账号!' }
            ],
          })(
            <Input
              className='border-bottom'
              onBlur={this.usernameOnBlur}
              onChange={(e) => { this.onLoginChange(e, 'username') }}
              placeholder="请输入账号"
            />
          )}
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码!' },
                { min: 0, max: 6, message: '请输入6位的密码!' },
              ],
            })(
              <Input.Password
                className='border-bottom'
                onChange={(e) => { this.onLoginChange(e, 'password') }}
                type="password"
                placeholder="请输入密码"
              />
            )
          }
        </FormItem>
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
        <Form.Item>
          <Button
            loading={this.props.loading}
            type="primary"
            htmlType="submit"
            className="login-form-button yellow-btn">
            登录
        </Button>
        </Form.Item>


        <div>
          {
            this.props.children
          }
        </div>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm