import baseHttpProvider from '../base/baseHttpProvider';
import { frnId } from "../../config/app.config.js";
import { md5 } from '../../utils/signMD5.js'
import Toast from '../../utils/toast.js'

/* 获取设备价格*******************************************************************
@params
username:用户名
password:密码

auth/verifyCodeLogin POST String username, String password
*/
const userLogin = (params) => {
  if (!params || !params.username || !params.password) {
    return Promise.reject();
  }
  return baseHttpProvider.postFormApi('auth/verifyCodeLogin', params, { tokenless: true })
}

const sendSms = (params) => {
  return baseHttpProvider.getApi('sendSms', params, { tokenless: true })
}

const forgetPassword = (params) => {
  if (params && params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.postFormApi('auth/forgetPassword', params, { tokenless: true })
}

const changePassword = (params) => {

  return baseHttpProvider.postFormApi('api/sys/admin/oper/updatePassword', params)
}

export {
  userLogin,
  sendSms,
  forgetPassword,
  changePassword
}