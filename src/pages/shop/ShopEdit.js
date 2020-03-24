import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker, Modal, Row, Col, Tree, Icon } from 'antd'
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import { NavLink, Link } from 'react-router-dom';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { saveOrUpdate, checkShopOper, getDetail } from '../../api/shopManage/shopList';
import { parseUrl, getReactRouterParams } from '../../utils/urlUtils';
import RelativeCategoryModal from "../../components/category/RelativeCategoryModal";
import moment from 'moment';
import './index.less';

// const _title = '创建门店';
const _description = "";
const shopListPath = routerConfig["shop.shopAuth.shopList"].path;
class Page extends Component {

  state = {
    isShowModal: false,
    status: null,
    category: [],
    categoryIds: [],
    date: null,
    imageUrl: null,
    shopOper: null,
    isChange: false,
    _title: null,
    idstatus: 0,
    userDetail: null,
    isdetection: false
  }

  componentDidMount() {
    let urlParams = parseUrl(this.props.location.search);
    let { id } = urlParams.args;
    let _title = id == 0 ? '创建门店' : '编辑门店';
    let isChange = id == 0 ? true : false;
    this.getDetail(id);
    this.setState({ _title, idstatus: id, isChange });
  }
  // 回滚数据
  getDetail = (id) => {
    if (!id || id == 0) {
      this.setState({
        userDetail: null
      })
      return;
    }
    getDetail({ id })
      .then(data => {
        let { name, address, businessScope, imageUrl, deadline, categoryList } = data;
        let { categoryIds, category } = this.state;
        let time = moment(deadline)
        categoryList && categoryList.map(item => {
          categoryIds.push(item.categoryId);
          category.push(item.name)
        })
        this.props.form.setFieldsValue({
          name,
          address, time
        });
        category =category? category.join(' '):null
        this.setState({
          userDetail: data,
          imageUrl: data.imageUrl,
          date: data.deadline,
          category,
          categoryIds
        })
      })
  }
  params = {

  }
  clickChange = () => {
    this.setState({ isChange: true })
  }
  saveDataClicked = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { date, imageUrl, shopOper, categoryIds, userDetail, status, idstatus, phone } = this.state;
      let deadlineStamp = dateUtil.getDayStartStamp(Date.parse(date));
      categoryIds = categoryIds ? categoryIds.join() : null;
      let id = userDetail ? userDetail.id : null;
      if (phone) {
        if (!shopOper) {
          Toast('请先检测手机号')
          return;
        }
      } else {
        if (!userDetail) {
          this.setState({ isShowTest: true, isShowerr: false });
          return;
        }
      }
      if(!categoryIds){
        Toast('请选择经营范围')
        return;
      }
      let shopOperId = shopOper ? shopOper.id : userDetail.shopOperId;
      let params = { ...data, imageUrl, deadlineStamp, shopOperId, id, categoryIds };
      saveOrUpdate(params)
        .then(() => {
          Toast(`${id ? "编辑" : "创建"}成功!`, "success");
          window.localStorage.setItem('editData', null);
          this.props.history.push('shopList');
        })
    })
  }

  // 选择经营分类
  clickChoose = () => {
    this.setState({ isShowModal: true })
  }

  handleOk = (params) => {
    let { categoryIds, category } = params;
    this.setState({ isShowModal: false, category, categoryIds });
  }

  hideCModal = () => {
    this.setState({ isShowModal: false })
  }

  // 检测手机号
  clickPhoneTest = () => {
    this.setState({ isdetection: true })
    let { phone } = this.state
    if (!phone) {
      this.setState({ isShowTest: true })
      return;
    }
    if (phone.length != 11) {
      this.setState({ isShowerr: true })
      return
    }
    this.params.phone = phone;
    checkShopOper(this.params)
      .then(data => {
        if (!data) {
          this.setState({ status: 0 });
          return
        }
        this.setState({ shopOper: data, status: 1 })
      })

  }
  onDateChange = (date, dateString) => {
    this.setState({ date: dateString });
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

    this.setState({
      imageUrl
    })
  }
  // 重置
  resetClicked = () => {
    this.setState({ phone: null, status: null, shopOper: null })
  }
  phoneChange = (e) => {
    this.setState({ phone: e.target.value })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { shopOper, category, userDetail } = this.state;
    return (
      <CommonPage title={this.state._title} description={_description} style={{ padding: '0' }}>
        <div style={{ display: 'flex', height: '30px', lineHeight: '30px' }}>
          <div style={{ width: '10px', background: '#FAAD14' }}></div>
          <div style={{ width: '100%', background: '#F2F2F2', paddingLeft: '10px', fontWeight: 'bold' }}>基础信息</div>
        </div>
        <div style={{ width: 600, padding: 20 }}>
          <Form className='common-form'>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='门店名称：'
              field='shopName'
            >
              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '输入门店名称' }
                  ]
                })(
                  <Input allowClear />
                )
              }
            </Form.Item>

            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='门店地址：'
              field='address'
            >
              {
                getFieldDecorator('address', {
                  rules: [
                    { required: true, message: '输入门店地址' }

                  ]
                })(
                  <Input allowClear />
                )
              }
            </Form.Item>

            <Row className='margin-top10'>
              <Col span={6} className='text-right label-required'>
                店招：
              </Col>
              <Col span={16} >
                <PictureWall
                  folder='shop'
                  pictureList={this.state.imageUrl ? [this.state.imageUrl] : null}
                  uploadCallback={this.uploadPic}
                />
              </Col>
            </Row>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label='授权截止'
              field='time'
            >
              <div style={{ display: 'flex', marginTop: '10px' }}>
                {
                  getFieldDecorator('time', {
                    rules: [
                      { required: true, message: '请选择时间' }

                    ]
                  })(
                    <DatePicker onChange={this.onDateChange} style={{ width: 170, height: '40px' }} showTime={true} placeholder={"请选择时间"} format="YYYY-MM-DD HH:mm:ss" />
                  )
                }
                <div style={{ color: 'red', marginLeft: '10px', lineHeight: '40px' }}>到达授权截止日期门店自动封禁</div>
              </div>

            </Form.Item>
            <Row className='line-height40'>
              <Col span={6} className='text-right label-required'>
                经营范围：
              </Col>
              <Col style={{ display: 'flex' }}>
                <span><Button type='primary' onClick={() => { this.clickChoose() }}>选择经营分类</Button></span>
                <span className='margin-left'>
                  {
                    category ?
                      <span>
                        {category}
                      </span>
                      :
                      "暂未选择商品分类"
                  }
                </span>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ display: 'flex', height: '30px', lineHeight: '30px' }}>
          <div style={{ width: '10px', background: '#FAAD14' }}></div>
          <div style={{ width: '100%', background: '#F2F2F2', paddingLeft: '10px', fontWeight: 'bold' }}>超管信息</div>
        </div>
        <div style={{ width: 600, padding: 20 }}>
          {
            this.state.idstatus != 0 ?
              <div style={{ display: 'flex', marginLeft: '13%', marginBottom: '10px' }}>
                <div>{userDetail && userDetail.nickname}</div>
                <div style={{ margin: '0 10px' }}>{userDetail && userDetail.username}</div>
                <div onClick={this.clickChange} style={{ color: '#ff6700' }}>更换超管</div>
              </div> : null
          }

          {
            this.state.isChange ?
              <div>
                <Row className='margin-top10'>
                  <Col span={6} className='text-right label-required'>
                    手机号：
              </Col>
                  <Col span={16} >
                    <div style={{ display: 'flex' }}>
                      <div>
                        <Input allowClear value={this.state.phone} onChange={this.phoneChange} />
                        {
                          this.state.isShowTest ? <div style={{ color: '#f5222d' }}>
                            {
                              this.state.isShowerr ? '手机号格式不正确' : '请输入手机号'
                            }
                          </div> : null
                        }
                      </div>
                      <Button type='primary' onClick={this.clickPhoneTest} style={{ margin: '0 10px' }}>检测</Button>
                      <Button type='primary' onClick={this.resetClicked}>重置</Button>
                    </div>
                  </Col>
                </Row>
                {
                  this.state.status == 0 ?
                    <div>
                      <div style={{ color: 'red', marginLeft: '13%', marginTop: '10px' }}>该手机号需在门店端完成注册后使用！</div>
                    </div> : null
                }
                {
                  this.state.status == 1 ?
                    <div style={{ marginLeft: '13%', marginTop: '10px' }}>
                      <div>存在账号，保存即确认使用此账号作为该门店的超级管理员</div>
                      <div style={{ display: 'flex', padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
                        <div style={{ width: '50px', height: '50px', background: "#ccc", marginRight: '10px' }}></div>
                        <div >
                          <div>{shopOper && shopOper.nickname}</div>
                          <div style={{ marginTop: '10px', color: '#ff6700' }}> {shopOper && shopOper.username}</div>
                        </div>
                      </div>
                    </div>
                    : null
                }
              </div>
              : null
          }
        </div>

        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button className='save-btn' type='primary' onClick={this.saveDataClicked} >保存</Button>
          <NavLink to={shopListPath}>
            <Button className='save-btn' type='primary'>返回</Button>
          </NavLink>
        </div>

        <RelativeCategoryModal
          maxLength={5}
          categoryIds={this.state.categoryIds}
          onOk={this.handleOk}
          onCancel={this.hideCModal}
          visible={this.state.isShowModal}
        />
      </CommonPage >
    )
  }


}

export default Form.create()(Page);