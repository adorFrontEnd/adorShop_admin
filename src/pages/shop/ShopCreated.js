import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker, Modal, Row, Col, Tree, Icon } from 'antd'
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import { NavLink, Link } from 'react-router-dom';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { saveOrUpdate, checkShopOper } from '../../api/shopManage/shopList';
import CategoryModal from "../../components/category/CategoryModal";
import './index.less';

const _title = '创建门店';
const _description = "";
const shopListPath = routerConfig["shop.shopAuth.shopList"].path;
class Page extends Component {

  state = {
    isShowModal: false,
    status: null,
    category: null,
    categoryIds: [],
    date: null,
    imageUrl: null, 
    shopOper: null
  }

  componentDidMount() {
  
  }

  params = {

  }

  shopCereated = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { date, imageUrl, shopOper, categoryIds } = this.state;
      let shopOperId = shopOper ? shopOper.id : null
      let deadlineStamp = dateUtil.getDayStartStamp(Date.parse(date));
      let params = { ...data, imageUrl, deadlineStamp, shopOperId, categoryIds:categoryIds.join() }
      saveOrUpdate(params)
        .then(() => {
          Toast('创建门店成功');
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
    this.setState({ isShowModal: false, category });
  }

  hideCModal = ()=>{
    this.setState({ isShowModal: false })
  }

  // 检测手机号
  clickPhoneTest = () => {
    let params = this.props.form.getFieldsValue();
    this.params.phone = params.phone;
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

  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { shopOper, category } = this.state
    return (
      <CommonPage title={_title} description={_description} style={{ padding: '0' }}>
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
              key='shopName'
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
              key='address'
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
                  folder='trace'
                  pictureList={this.state.imageUrl ? [this.state.imageUrl] : null}
                  uploadCallback={this.uploadPic}
                />
              </Col>
            </Row>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label='授权截止'
              key='deadlineStamp'
              field='deadlineStamp'
            >
              <div style={{ display: 'flex' }}>
                {
                  getFieldDecorator('deadlineStamp', {
                    rules: [
                      { required: true, message: '请选择时间' }

                    ]
                  })(
                    <DatePicker onChange={this.onDateChange} />
                    // <DatePicker onChange={this.onDateChange} style={{ width: 170 }} showTime={true} placeholder={"请选择时间"} format="YYYY-MM-DD HH:mm:ss" />
                  )
                }
                <div style={{ color: 'red', marginLeft: '10px' }}>到达授权截止日期门店自动封禁</div>
              </div>

            </Form.Item>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='经营范围：'
              key=' businessScope '
              field='businessScope'
            >
              <div style={{ display: 'flex' }}>
                <Button onClick={() => { this.clickChoose() }} style={{ width: 150, marginRight: '20px' }} type='primary'>选择经营分类</Button>
                {category}
              </div>

            </Form.Item>
          </Form>



        </div>
        <div style={{ display: 'flex', height: '30px', lineHeight: '30px' }}>
          <div style={{ width: '10px', background: '#FAAD14' }}></div>
          <div style={{ width: '100%', background: '#F2F2F2', paddingLeft: '10px', fontWeight: 'bold' }}>超管信息</div>
        </div>
        <div style={{ width: 600, padding: 20 }}>
          <Form>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              label='手机号：'
              key='phone'
              field='phone'
            >
              <div style={{ display: 'flex' }}>
                {
                  getFieldDecorator('phone', {
                    rules: [
                      { required: true, message: '输入门店地址' }

                    ]
                  })(
                    <Input allowClear />
                  )
                }
                <Button type='primary' onClick={this.clickPhoneTest} style={{ margin: '0 10px' }}>检测</Button>
                <Button type='primary' onClick={this.clickReset}>重置</Button>
              </div>

            </Form.Item>
            {
              this.state.status == 0 ?
                <div>
                  <div style={{ color: 'red', marginLeft: '13%' }}>该手机号需在门店端完成注册后使用！</div>

                </div> : null

            }
            {
              this.state.status == 1 ?
                <div style={{ marginLeft: '13%' }}>
                  <div>存在账号，保存即确认使用此账号作为该门店的超级管理员</div>
                  <div style={{ display: 'flex', padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
                    <div style={{ width: '50px', height: '50px', background: "#ccc", marginRight: '10px' }}></div>
                    <div >
                      <div>{shopOper && shopOper.nickname}</div>
                      <div style={{ marginTop: '10px', color: '#ff6700' }}> {shopOper && shopOper.username}</div>
                    </div>
                  </div>
                </div> : null
            }

          </Form>
        </div>


        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Button className='save-btn' type='primary' onClick={this.shopCereated} disabled={this.state.status == 0}>保存</Button>
          <NavLink to={shopListPath}>
            <Button className='save-btn' type='primary'>返回</Button>
          </NavLink>
        </div>

        <CategoryModal
          categoryIds = {this.state.categoryIds}
          onOk={this.handleOk}
          onCancel={this.hideCModal}
          visible={this.state.isShowModal}
        />
      </CommonPage >
    )
  }

  
}

export default Form.create()(Page);