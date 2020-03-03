import React, { Component } from "react";
import { Col, Row, Form, Button, Input, Table, Popconfirm, Modal, Checkbox, Divider, Select, InputNumber, Cascader } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import {  SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchList, saveOrUpdate, levelList, saveSort, deleteClassify } from '../../api/setting/ClasssifySetting';
import { searchRoleList } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';
import { parseTree, getTreeLeMapLevelList } from '../../utils/tree';
import PictureWall from '../../components/upload/PictureWall';

const _title = "分类设置";
const _description = "";
const { Option } = Select;
class Page extends Component {

  state = {
    checked: false,
    tableDataList: null,
    imageUrl: null,
    classList: null,
    selectValue: null,
    changedClassifySort: {}
  }

  componentWillMount() {
    this.getPageData();
    this.getlevelList();

  }

  params = {
    page: 1
  }


  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current;
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize;
        _this.getPageData();
      })

      let tableDataList = res.data.sort(this.objectArraySort('parentId'));
      if (tableDataList[0].parentId == 0) {
        tableDataList = parseTree(tableDataList, true);
      }
      this.setState({
        tableDataList,
        pagination: _pagination
      })
    }).catch(() => {
      this._hideTableLoading();
    })
  }

  objectArraySort = (keyName) => {
    return function (objectN, objectM) {
      var valueN = objectN[keyName]
      var valueM = objectM[keyName]
      if (valueN > valueM) return 1
      else if (valueN < valueM) return -1
      else return 0
    }
  }
  _showTableLoading = () => {
    this.setState({ showTableLoading: true });
  }

  _hideTableLoading = () => {
    this.setState({ showTableLoading: false });
  }
  // 获取分类
  getlevelList = () => {
    levelList({ page: 1, size: 100 })
      .then(res => {
        if (res && res && res.length) {
          let classList = getTreeLeMapLevelList(res);
          classList = classList.treeData;
          this.setState({ classList });
        }
      })
  }

  // 表格相关列 
  columns = [
    {
      title: "分类名称", dataIndex: "name"
    },
    { title: "分类图片", dataIndex: "imageUrl", render: data => <span><img style={{ height: 40, width: 40 }} src={data} /></span> },
    {
      title: "排序", dataIndex: "roleName",
      render: (text, record, index) => (
        <span>
          <InputNumber size="small" onChange={(value) => { this.onClassifySortChange(value, record.id) }} style={{ width: 80, marginRight: 10 }} min={0} max={9999999} value={record.sort} />
        </span>
      )

    },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span>
            <a onClick={() => { this.showAcountModal(record) }}>编辑信息</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => { this.deleteClassify(record) }} >
              <a size="small" style={{ color: '#ff8716' }}>删除</a>
            </Popconfirm>
          </span>
        </span>
      )
    }
  ]

  /* Modal操作*******************************************************************************************************************************************/

  newItemFormList = [
    {
      type: "INPUT",
      field: "name",
      label: "分类名称:",
      placeholder: "请输入名称",
      rules: [
        { required: true, message: '请输入名称!' }
      ]
    }
    
  ]
  // 打开modal
  showAcountModal = (data) => {
    this.setState({
      newItemModalVisible: true
    })
    let selectOper = data || null;
    let editFormValue = {};
    let image
    if (data) {
      let { name, status, imageUrl, parentId, level } = data;
      parentId = { key: level, name: name };
      image = imageUrl;
      editFormValue = { name };
    }
    this.setState({
      editFormValue,
      selectOper, imageUrl: image
    })
  }

  // 关闭modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }

  newItemModalSaveClicked = (data) => {
    let { checked, imageUrl, selectValue } = this.state;
    let reslut = this.formatParmas(checked, selectValue);
    let { parentId, level, isSuperclass } = reslut;
    let params = { ...data, parentId, level, isSuperclass, imageUrl };
    let title = '添加分类成功！';
    if (this.state.selectOper) {
      let { id } = this.state.selectOper;
      params.id = id;
      title = '修改分类成功！'
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title);
        this.getPageData();
        this._hideNewItemModal();
      })
  }
  // 处理参数
  formatParmas = (checked, selectValue) => {
    let parentId
    let isSuperclass
    let level
    let selectlevel
    if (selectValue) {
      selectValue = selectValue.pop().split('-');
      parentId = selectValue[1];
      selectlevel = selectValue[2];
    }
    if (checked) {
      isSuperclass = 1;
      parentId = 0;
      level = 1
    } else {
      isSuperclass = 0;
      if (selectlevel == 1) {
        level = 2;
      } else if (selectlevel == 2) {
        level = 3;
      }
    }
    return { parentId, isSuperclass, level }
  }
  // 删除分类
  deleteClassify = (record) => {
    let { id } = record;
    deleteClassify({ id })
      .then(() => {
        Toast("删除成功！");
        this.getPageData();
      })
  }

  uploadPic = (picList) => {
    let imageUrl = ''
    if (!picList || !picList.length) {
      this.setState({
        imageUrl
      })
      return;
    }
    imageUrl = picList[0];
    this.setState({ imageUrl })
  }
  //保存分类排序
  saveClassifyOrder = () => {
    let order = this.formatSortSaveData(this.state.changedClassifySort);
    if (!order) {
      Toast('排序暂未修改！');
      return;
    }
    let ids = [];
    let sorts = [];
    order.map(item => {
      ids.push(item.id);
      sorts.push(item.sort)
    })
    ids = ids.join();
    sorts = sorts.join();
    saveSort({ ids, sorts })
      .then(() => {
        Toast('保存成功');
        this.getPageData();
      })
  }
  //格式化保存分类的数据
  formatSortSaveData = (changedClassifySort) => {
    if (!changedClassifySort || !Object.keys(changedClassifySort).length) {
      return;
    }
    let result = Object.keys(changedClassifySort).map(k => {
      return {
        id: k,
        sort: changedClassifySort[k]
      }
    });
    return result;
  }

  // 分类的排序input更改
  onClassifySortChange = (value, id) => {
    let tableDataList = this.state.tableDataList;
    if (!tableDataList) {
      return;
    }
    let index = this.findClassifyIndexById(id, tableDataList);
    if (index || index == 0) {
      tableDataList[index]['sort'] = value;
      let changedClassifySort = this.state.changedClassifySort;
      changedClassifySort[id] = value;
      this.setState({
        changedClassifySort
      })

    }
  }

  // 查找分类在数组的索引
  findClassifyIndexById = (id, arr) => {
    if (!id || !arr || !arr.length) {
      return;
    }
    let index = arr.findIndex((item) => {
      return item.id && item.id == id;
    });
    return index >= 0 ? index : null;
  }

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();
    let { inputKey, inputValue, ...data } = params;
    this.params.page = 1;
    this.params.inputData = params.name;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  onChange = (e) => {
    this.setState({ checked: e.target.checked });
  }
  onSlectChange = (value) => {
    this.setState({ selectValue: value });

  }
  displayRender = (label) => {
    return label[label.length - 1];
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
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
          <div style={{ display: 'flex' }}>
            {/* <Button style={{ width: 100 }} type='primary'>全选/取消</Button> */}
            <Button onClick={() => { this.showAcountModal() }} style={{ width: 100, margin: '0 10px' }} type='primary'>添加分类</Button>
            {/* <Button style={{ width: 100 }} type='primary'>保存排序</Button> */}
            <Popconfirm
              placement="topLeft" title={'确认要保存产品的排序设置吗？'}
              onConfirm={() => { this.saveClassifyOrder() }} >
              <Button type='primary' className='normal margin-right20'>保存排序</Button>
            </Popconfirm>
          </div>

          <Form layout='inline'>
            <Form.Item
              field="name"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {
                getFieldDecorator('name', {
                })(
                  <Input allowClear style={{ width: "240px" }} placeholder='填写分类名称' onChange={this.boxInputDataChange} />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.searchClicked}>筛选</Button>
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.resetClicked}>重置</Button>
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
          rowSelection={rowSelection}
        />

        <Modal maskClosable={false}
          title="创建/编辑分类"
          visible={this.state.newItemModalVisible}
          footer={null}
          onCancel={this._hideNewItemModal}
          className='noPadding'
        >
          <SubmitForm
            clearWhenHide={true}
            showForm={this.state.newItemModalVisible}
            setFormValue={this.state.editFormValue}
            formItemList={this.newItemFormList}
            saveClicked={this.newItemModalSaveClicked}
            cancelClicked={this._hideNewItemModal}
          >
            <Row className='line-height40'>
              <Col span={8} className='text-right'>
                父分类：
              </Col>
              <Col span={12}>
                <div>
                  <Cascader
                    options={this.state.classList}
                    expandTrigger="hover"
                    displayRender={this.displayRender}
                    onChange={this.onSlectChange}
                    changeOnSelect
                    style={{ width: 240 }}
                  />
                </div>
              </Col>
            </Row>
            <Row className='line-height40'>
              <Col span={8} className='text-right'>
              </Col>
              <Col span={16}>
                <div>
                  <Checkbox checked={this.state.checked} onChange={this.onChange} disabled={this.state.parentId} />
                  <span className='margin-left'>无父分类</span>
                </div>
              </Col>
            </Row>
            <Row className='margin-top10'>
              <Col span={8} className='text-right label-required'>
                分类图片：
              </Col>
              <Col span={16} >
                <PictureWall
                  folder='trace'
                  pictureList={this.state.imageUrl ? [this.state.imageUrl] : null}
                  uploadCallback={this.uploadPic}
                />
              </Col>
            </Row>
            <Row className='line-height40'>
              <Col span={8} className='text-right'>
              </Col>
              <Col span={16}>
                <div className='color-red'>
                  图片大小不超过2MB
                </div>
              </Col>
            </Row>
          </SubmitForm>
        </Modal>
      </CommonPage >)
  }
}

export default Form.create()(Page);