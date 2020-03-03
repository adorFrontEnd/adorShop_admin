import React from 'react';
import asyncComponent from "../components/asyncComponent/asyncComponent";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { baseRoute, routerConfig } from '../config/router.config';
import { isUserLogin } from '../middleware/localStorage/login';
import { getCacheFirstEnterPage } from '../middleware/localStorage/cacheAuth';
import Login from "../pages/login";
import Changepwd from "../pages/login/ChangePwd";
import ForgotPwd from "../pages/login/ForgotPwd";
import AccountSelect from "../pages/login/AccountSelect";

const Admin = asyncComponent(() => import("../pages/admin"));
const Home = asyncComponent(() => import("../pages/home/Home"));

const RoleAuth = asyncComponent(() => import("../pages/oper/RoleAuth"));
const OperManage = asyncComponent(() => import("../pages/oper/OperManage"));


const ShopList = asyncComponent(() => import("../pages/shop/ShopList"));
const ShopEdit = asyncComponent(() => import("../pages/shop/ShopEdit"));

const AreaSetting = asyncComponent(() => import("../pages/globalSetting/AreaSetting"));
const ClasssifySetting = asyncComponent(() => import("../pages/globalSetting/ClasssifySetting"));




export default class GlobalRouter extends React.Component {
  render() {
    let firstEnterPagePath = getCacheFirstEnterPage();
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/" render={() => (
            isUserLogin() ?
              <Redirect to={routerConfig["shop.shopAuth.shopList"].path} />
              :
              <Redirect to={{ pathname: routerConfig["login"].path }} />
          )} />

          <Route exact={true} path={routerConfig["login"].path} component={Login} />
          <Route exact={true} path={routerConfig["changepwd"].path} component={Changepwd} />
          <Route exact={true} path={routerConfig["forgotPwd"].path} component={ForgotPwd} />
          <Route exact={true} path={routerConfig["accountSelect"].path} component={AccountSelect} />

          <Route path={baseRoute} render={() => (
            isUserLogin() ?
              <Admin>
                <Switch>
                  <PrivateRoute path={routerConfig["oper.roleAuth"].path} component={RoleAuth} />
                  <PrivateRoute path={routerConfig["oper.operManage"].path} component={OperManage} />

                  <PrivateRoute path={routerConfig["shop.shopAuth.shopList"].path} component={ShopList} />
                  <PrivateRoute path={routerConfig["shop.shopAuth.shopEdit"].path} component={ShopEdit} />

                  <PrivateRoute path={routerConfig["globalSetting.areaSetting.areaDeploy"].path} component={AreaSetting} />
                  <PrivateRoute path={routerConfig["globalSetting.classsifySetting.shopClassify"].path} component={ClasssifySetting} />

                  
                </Switch>
              </Admin>
              : <Redirect to={{ pathname: routerConfig["login"].path }} />
          )} />
        </Switch>
      </Router >
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        props =>
          isUserLogin() ?
            <Component {...props} />
            : <Redirect to={{ pathname: routerConfig["login"].path, state: { from: props.location } }} />
      }
    />
  )
}
