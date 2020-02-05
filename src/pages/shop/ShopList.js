import React, { Component } from "react";
import { Col, Row, Card, Spin, Form, Button, Input, Table, Popconfirm, Divider, Modal, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchOperList, deleteOper, saveOrUpdate } from '../../api/oper/oper';
import { searchRoleList } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
const _title = "门店列表";
const _description = "";
const shopEditPath = routerConfig["shop.shopAuth.shopEdit"].path;
const shopCreatedPath = routerConfig["shop.shopAuth.shopCreated"].path;
class Page extends Component {

  state = {
    tableDataList: null,
  }

  componentWillMount() {


  }

  params = {
    page: 1
  }







  // 表格相关列 
  columns = [
    { title: "门店名称", dataIndex: "nickname" },
    { title: "店招", dataIndex: "username" },
    { title: "地址", dataIndex: "roleName", render: data => data || '--' },
    { title: "联系人", dataIndex: "roleName", render: data => data || '--' },
    { title: "超管账号", dataIndex: "roleName", render: data => data || '--' },
    { title: "经营范围", dataIndex: "roleName", render: data => data || '--' },
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "状态", dataIndex: "roleName", render: data => data || '--' },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.roleName != '超级管理员' ?
              <span>
                <NavLink to={shopEditPath}>编辑</NavLink>
                <Divider type="vertical" />
                <a onClick={() => { this.showPasswordModal(record) }}>封店</a>
                <Divider type="vertical" />
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  onConfirm={() => { this.deleteOper(record) }} >
                  <a size="small" className='color-red'>删除</a>
                </Popconfirm>
              </span>
              :
              <a onClick={() => { this.showPasswordModal(record) }}>重置密码</a>
          }
        </span>
      )
    }
  ]

  goShopCreated = (id) => {
    let title = 'chuangjian'
    this.props.changeRoute({ path: 'shop.shopAuth.shopCreated', title, parentTitle: '创建门店' });
  }






  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} description={_description} >
        <div className='margin10-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <NavLink to={shopCreatedPath}>
            <Button style={{ width: 100 }} type='primary'>创建门店</Button>
          </NavLink>
          <Form layout='inline'>
            <Form.Item>
              {
                getFieldDecorator('inputKey', {
                  initialValue: "nicknameParam"
                })(
                  <Select>
                    <Select.Option value='nicknameParam'>全部状态</Select.Option>
                    <Select.Option value='usernameParam'>正常</Select.Option>
                    <Select.Option value='usernameParam'>已封</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item>
              <Input placeholder='商品名称/商品编号' onChange={this.boxInputDataChange} />
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.getPageData}>查询</Button>
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.getPageData}>重置</Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.tableDataList}
        />




      </CommonPage >)
  }
}
const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Page));