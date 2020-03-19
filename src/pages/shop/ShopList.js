import React, { Component } from "react";
import { Form, Button, Input, Table, Popconfirm, Divider, Modal, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import dateUtil from '../../utils/dateUtil';
import { shopList, updateStatus } from '../../api/shopManage/shopList';
import { parseUrl, getReactRouterParams } from '../../utils/urlUtils';
import { pagination } from '../../utils/pagination';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
const _title = "门店列表";
const _description = "";
const _shopStatus = {
  "1": "正常",
  "0": "已封"
}
const _shopStatusArr = Object.keys(_shopStatus).map(item => { return { id: item, name: _shopStatus[item] } });
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
    { title: "经营范围", dataIndex: "businessScope", render: data => data ? data.substring(0, data.length - 1) : '--' },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: "状态",
      render: (text, record, index) => (
        <span>
          {
            record.status == 1 ?
              <span>
                {record.overStatus == 0 ?
                  <span>正常</span> : null
                }
              </span>
              :
              <span style={{ color: '#ff8716' }}>
                {record.overStatus == 0 ?
                  <span>已封</span> : <span>已封（封店+过期）</span>
                }
              </span>
          }
        </span>
      )
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span>
            <span onClick={() => this.goShopEdit(record)} style={{ color: '#ff8716' }}>编辑</span>
            <Divider type="vertical" />
            {
              record.status == 1 ?
                <Popconfirm
                  placement="topLeft" title='确认要封店吗？'
                  onConfirm={() => { this.shopUpdateStatus(record) }} >
                  <a size="small" style={{ color: '#ff8716' }}>封店</a>
                </Popconfirm>
                :
                <Popconfirm
                  placement="topLeft" title='确认要恢复吗？'
                  onConfirm={() => { this.shopUpdateStatus(record) }} >
                  <a size="small" style={{ color: '#ff8716' }}>恢复</a>
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
  // 顶部查询表单
  formItemList = [
    {
      type: "SELECT",
      field: "status",
      style: { width: 140 },
      defaultOption: { id: null, name: "全部状态" },
      placeholder: '选择状态',
      initialValue: null,
      optionList: _shopStatusArr
    },
    {
      type: "INPUT",
      field: "inputData",
      style: { width: 300 },
      placeholder: "门店名称/联系人"
    }]

  //查询按钮点击事件
  searchClicked = (params) => {
    let { inputData, storeStatus } = params;
    inputData = inputData || null;
    storeStatus = storeStatus || null;
    this.params = {
      page: 1,
      ...params,
      inputData,
      storeStatus
    }
    this.getPageData();
  }

  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  goShopEdit = (data) => {
    let pathParams
    if (data.id) {
      pathParams = getReactRouterParams('shopEdit', { id: data.id });
      data = JSON.stringify(data)
      window.localStorage.setItem('editData', data);
    } else {
      pathParams = getReactRouterParams('shopEdit', { id: 0 });
    }
    this.props.history.push(pathParams);
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
            <Button style={{ width: 100 }} type='primary' onClick={this.goShopEdit}>创建门店</Button>
            <div style={{ minWidth: 700 }}>
              <SearchForm
                width={700}
                searchText='筛选'
                towRow={false}
                searchClicked={this.searchClicked}
                formItemList={this.formItemList}
              />
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