import React, { Component } from "react";
import { message } from 'antd';
import LoginForm from './LoginForm';
import { userLogin } from '../../api/oper/login';
import { setCacheUserInfo, getCacheAccountList, setCacheAccountList } from '../../middleware/localStorage/login';
import { baseRoute, routerConfig } from '../../config/router.config';
import { NavLink, Link } from 'react-router-dom';
import { md5 } from "../../utils/signMD5";
import './index.less';

export default class Login extends Component {

  state = {
    showBtnLoading: false,
    isShow: false
  }

  componentDidMount() {
    document.title = '爱朵电商 | 总后台'
  }

  login = (data) => {
    let params = {
      username: data.username,
      password: md5(data.password),
      verifyCode: data.imageCode,
      now: Date.now()
    }
    if (this.state.showBtnLoading) {
      return
    }

    this.setState({
      showBtnLoading: true
    })

    userLogin(params).then((res) => {

      if (res ) {
        message.success("登录成功！");
        setCacheAccountList({ username: params.username, password: params.password, loginAccounts: res.loginAccounts });
        setCacheUserInfo(res)
        if (res.updatePassword == 0) {
          setTimeout(() => {
            this.props.history.push(routerConfig['changepwd'].path);
          }, 1000);
          return;
        }
        setTimeout(() => {
          this.props.history.push(routerConfig['shop.shopAuth'].path);
          this.setState({
            showBtnLoading: false
          })
        }, 1000);

        this.setState({
          showBtnLoading: false
        })
      }
    })
      .catch(() => {
        this.setState({
          showBtnLoading: false,
          isShow: false
        })
      })
  }
  render() {
    return (
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "700px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", position: 'relative' }}>
            <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
            <div className='login-form-title'>爱朵电商</div>
            <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
              总后台
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>登录</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: "space-between", padding: '20px 4px' }}>
          <div style={{ width: 366, flex: "0 0 auto", display: "flex", alignItems: "center" }} >
            <LoginForm loading={this.state.showBtnLoading} login={this.login} isShow={this.state.isShow} >
              <div style={{ lineHeight: "20px", padding: "0 6px 20px 0", textAlign: "right" }}>
                <NavLink to='/forgotPwd' >忘记密码</NavLink >
              </div>
            </LoginForm>
          </div>
          <div style={{ width: "45%", marginLeft: "12px" }}>
            <img src='/image/bg.png' style={{ maxWidth: "100%" }} />
          </div>
        </div>
      </div>
    )
  }
}



