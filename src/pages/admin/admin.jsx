import React, { Component } from 'react';
import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Pie from '../charts/pie'
import Bar from '../charts/bar'
import Line from '../charts/line'

const { Footer, Sider, Content } = Layout;
/*
 back-end management router component
*/

export default class Admin extends Component {
    render () {
        const user = memoryUtils.user;
        if (!user || !user._id) {
            //如果内存中没有存储user ==> 没有登陆
            //自动跳转到登陆（render中）
            return <Redirect to='/login'></Redirect>
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ margin: 20, backgroundColor: 'white' }}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/user' component={User} />
                            <Route path='/role' component={Role} />
                            <Route path='/product' component={Product} />
                            <Route path='/charts/pie' component={Pie} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/bar' component={Bar} />
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}