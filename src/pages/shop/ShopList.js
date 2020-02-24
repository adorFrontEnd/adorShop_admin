import React, { Component } from "react";
import { Col, Row, Card, Spin, Form, Button, Input, Table, Popconfirm, Divider, Modal, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { shopList, updateStatus } from '../../api/shopManage/shopList';

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
    selectedRowKeys: null,
    showTableLoading: false
  }

  componentWillMount() {
    this.getPageData();

  }

  params = {
    page: 1
  }
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    shopList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize
        _this.getPageData();
      })

      this.setState({
        tableDataList: res.data,
        pagination: _pagination
      })
    }).catch(() => {
      this._hideTableLoading();
    })
  }

  // 表格相关列 
  columns = [
    { title: "门店名称", dataIndex: "name" },
    { title: "店招", dataIndex: "imageUrl", render: data => <span><img style={{ height: 40, width: 40 }} src={data} /></span> },
    { title: "地址", dataIndex: "address", render: data => data || '--' },
    { title: "联系人", dataIndex: "nickname", render: data => data || '--' },
    { title: "超管账号", dataIndex: "username", render: data => data || '--' },
    { title: "经营范围", dataIndex: "categoryIds", render: data => data || '--' },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    // { title: "状态", dataIndex: "status", render: data => data == 1 ? "正常" : '封店' },
    {
      title: "状态",
      render: (text, record, index) => (
        <span>
          {
            record.status == 1 ? <span> 正常</span> : <span className='color-red'>已封</span>
          }
        </span>

      )
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>

          <span>
            {/* <Link to={shopEditPath + `?record=${record.id+record.username+record.nickname}`} className='color-red'>编辑</Link>
             */}
            <div onClick={() => this.goShopEdit(record)}>编辑</div>
            <Divider type="vertical" />
            {
              record.status == 1 ?
                <Popconfirm
                  placement="topLeft" title='确认要封店吗？'
                  onConfirm={() => { this.shopUpdateStatus(record) }} >
                  <a size="small" className='color-red'>封店</a>
                </Popconfirm>
                :
                <Popconfirm
                  placement="topLeft" title='确认要恢复吗？'
                  onConfirm={() => { this.shopUpdateStatus(record) }} >
                  <a size="small" className='color-red'>恢复</a>
                </Popconfirm>
            }

          </span>

        </span>
      )
    }
  ]
  _showTableLoading = () => {
    this.setState({
      showTableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      showTableLoading: false
    })
  }
  // 状态修改
  shopUpdateStatus = (data) => {
    let { id } = data;
    updateStatus({ id })
      .then(data => {
        Toast('操作成功！');
        this.getPageData();
      })
  }
  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  //查询按钮点击事件

  searchClicked = () => {
    let params = this.props.form.getFieldsValue();
    let inputData = params.inputValue
    let { inputKey, inputValue, ...data } = params;
    let _data = {};
    if (inputKey != 'null') {
      _data.status = inputKey || null;
    }
    _data.inputValue = inputValue || null;
    this.params = {
      ...data,
      ..._data
    }

    this.params.page = 1;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }
  goShopEdit = (data) => {
    data = JSON.stringify(data)
    window.localStorage.setItem('editData', data);
    this.props.history.push('shopEdit');
  }






  render() {
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };
    return (
      <CommonPage title={_title} description={_description} >
        <div style={{ padding: '10px' }}>
          <div className='margin10-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <NavLink to={shopCreatedPath}>
              <Button style={{ width: 100 }} type='primary'>创建门店</Button>
            </NavLink>
            <div className='flex-between align-center margin-bottom20'>
              <Form layout='inline'>
                <Form.Item>
                  {
                    getFieldDecorator('inputKey', {
                      initialValue: "null"
                    })(
                      <Select>
                        <Select.Option value='null'>全部状态</Select.Option>
                        <Select.Option value='1'>正常</Select.Option>
                        <Select.Option value='0'>已封</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
                <Form.Item
                  field="inputValue"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                >
                  {
                    getFieldDecorator('inputValue', {
                    })(
                      <Input allowClear style={{ width: "240px" }} placeholder='商品名称/商品编号' onChange={this.boxInputDataChange} />
                    )
                  }
                </Form.Item>

              </Form>
              <div style={{ minWidth: 370 }}>
                <Button type='primary' className='normal margin0-20' onClick={() => { this.searchClicked() }}>查询</Button>
                <Button className='normal' onClick={this.resetClicked}>重置</Button>

              </div>
            </div>
          </div>

          <Table
            indentSize={10}
            rowKey="id"
            columns={this.columns}
            loading={this.state.showTableLoading}
            pagination={this.state.pagination}
            dataSource={this.state.tableDataList}
            rowSelection={rowSelection}

          />
        </div>




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