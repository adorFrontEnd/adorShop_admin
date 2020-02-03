import React, { Component } from "react";
import { Menu, Icon } from 'antd';
import './index.less';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeRoute } from '../../../store/actions/route-actions'
import { getRouter } from '../../../router/routerParse';
import { getCacheRouterConfig, getCacheUserInfo } from '../../../middleware/localStorage/login'

import store from '../../../store/store'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class LeftBar extends Component {

  routeList = null;
  // 回收菜单
  rootSubmenuKeys = null;

  componentWillMount() {
    let userInfo = getCacheUserInfo();
    let data = userInfo.data;
    let routerData = data.filter((val) => (val.indexOf(".") != -1 || (val == 'home')));
    this.routeList = getRouter(routerData);
    this.rootSubmenuKeys = this.routeList.map(item => item.key);
    const menuTree = this.renderMenu(this.routeList);
    this.setState({
      menuTree,
      current: '1',
      openKeys: [],
    })
  }

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  // 点击菜单
  handleClick = (path, title, parentTitle) => {

    this.props.changeRoute({ path, title, parentTitle });
    this.setState({
      current: path.toString()
    });
  }

  render() {
    return (
      <div>
        <div className='logo'>
          {
            this.props.collapsed ?
              <div>
                <div className='img-wrap' style={{width:"80px"}}>
                  <img src='/favicon.ico' style={{height:30,width:"auto"}} alt='' />
                </div>                
              </div>
              :
              <div className='flex align-center'>
                <div className='img-wrap'>
                  <img src='/favicon.ico' alt='' />
                </div>
                <div className='logo-title ellipsis'>爱朵钱包 | <span className='font-14'>企业支付开放平台</span></div>
              </div>
          }
        </div>
        <Menu
          theme="dark"
          selectedKeys={[this.state.current]}
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
        >
          {this.state.menuTree}
        </Menu>
      </div>
    )
  }
  // 左侧的菜单渲染
  renderMenu = (data, parentTitle) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <SubMenu title={<span><Icon type={item.icon} style={{ fontSize: 18 }} /><span>{item.title}</span></span>} key={item.key}>
            {this.renderMenu(item.children, item.title)}
          </SubMenu>
        )
      }
      return <Menu.Item title={item.title} onClick={() => { this.handleClick(item.key, item.title, parentTitle) }} key={item.key} mode="inline">
        <NavLink to={item.path}>
          <Icon type={item.icon} style={{ fontSize: 18 }} />
          {item.title}
        </NavLink>
      </Menu.Item>
    })
  }

}
const mapStateToProps = state => state
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftBar)






