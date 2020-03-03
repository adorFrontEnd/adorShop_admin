import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { sendSms, changePassword } from '../../api/oper/login';
import { md5 } from '../../utils/signMD5.js';
import { baseRoute, routerConfig } from '../../config/router.config';
import { getCacheAccountList, setCacheAccountList, getCacheUserInfo } from '../../middleware/localStorage/login';

import './index.less';
import Toast from "../../utils/toast";

class Page extends Component {

  state = {
    showBtnLoading: false,
    phone: null,
    redirectLogin: false
  }

  componentDidMount() {
    document.title = '爱朵电商 | 总后台'
    this.getPageData();
  }

  goback = () => {
    window.history.back();
  }

  getPageData = () => {
    let accounts = getCacheAccountList();
    if (accounts && accounts.username) {
      this.setState({
        phone: accounts.username,
        redirectLogin: false
      })
    } else {
      let cacheUserInfo = getCacheUserInfo();
      this.setState({
        phone: cacheUserInfo.phoneNumber,
        redirectLogin: true
      })
    }
  }

  submitClicked = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { oldPassword, newPassword, repeatPassword } = data;
      let phone = this.state.phone;
      if (newPassword != repeatPassword) {
        Toast("重复密码不一致！");
        return;
      }
      let params = {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)
       
      }
      this.setState({
        showBtnLoading: true
      })

      changePassword(params)
        .then(() => {
          Toast("修改成功！");
          if (this.state.redirectLogin) {
            this.props.history.push(routerConfig['login'].path);
            return;
          }
          let accounts = getCacheAccountList();
          let { password, ...cacheData } = accounts;
          password = params.newPassword;
          setCacheAccountList({ password, ...cacheData });
          setTimeout(() => {
            this.setState({
              showBtnLoading: false
            })
            this.props.history.push(routerConfig['shop.shopAuth.shopList'].path);
          }, 1000)

        })
        .catch(() => {
          this.setState({
            showBtnLoading: false
          })
        })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "760px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", position: 'relative' }}>
            <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
            <div className='login-form-title'>爱朵电商</div>
            <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
              总平台
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>修改密码</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: "space-between", padding: '20px 4px' }}>
        <div style={{ width: 366, flex: "0 0 auto", display: "flex", alignItems: "center" }} >
          <Form theme='dark' className='login-form' style={{ width: 450}}>
            <Form.Item>
              {
                getFieldDecorator('oldPassword', {
                  rules: [
                    { required: true, message: '请输入原始密码!' }
                  ],
                })(
                  <Input.Password
                    type="password" placeholder="请输入原始密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{0,6}$/, message: '6位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    type="password" placeholder="请输入新密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('repeatPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{0,6}$/, message: '6位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    type="password" placeholder="重复新密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
      
          {/* 登录按钮 */}
          <Button
            shape="round"           
            loading={this.props.loading}
            type="primary"
            htmlType="submit"
            onClick={this.submitClicked}
            className="login-form-button yellow-btn">
            保存
          </Button>
        
        </Form.Item>
          </Form>
        </div>
        <div style={{ width: "45%", flex: "1 1 auto", display: "flex", alignItems: "center", marginLeft: "12px" }}>
            <img src='/image/bg.png' style={{ maxWidth: "100%" }} />
          </div>
        </div>
      </div>
    )
  }
}
export default Form.create()(Page)


