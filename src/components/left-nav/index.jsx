import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import './index.less'
import logo from '../../assets/imgs/logo.png'
import {
    HomeOutlined,
    AppstoreOutlined,
    BarsOutlined,
    ToolOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    AreaChartOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';

/*
左侧导航的组件
*/

const { SubMenu } = Menu;

class LeftNav extends Component {

    componentWillMount () {
        this.path = this.props.location.pathname;
        if (this.path === "/category" || this.path.indexOf("/product") === 0) {
            this.menuItemShouldOpen = "p";
        }
        if (this.path === "/charts/line" || this.path === "/charts/pie" || this.path === "/charts/bar") {
            this.menuItemShouldOpen = "/charts";
        }
    }

    render () {
        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt='logo'></img>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[this.menuItemShouldOpen]}
                    mode="inline"
                    theme="dark"
                >
                    <Menu.Item key="/home">
                        <Link to='/home'>
                            <HomeOutlined />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="p"
                        title={
                            <span>
                                <AppstoreOutlined />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>
                                <BarsOutlined />
                                品类管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/product">
                            <Link to='/product'>
                                <ToolOutlined />
                                商品管理
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="/user">
                        <Link to='/user'>
                            <UserOutlined />
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/role">
                        <Link to='/role'>
                            <SafetyCertificateOutlined />
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="/charts"
                        title={
                            <span>
                                <AreaChartOutlined />
                                <span>图形图表</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/charts/line">
                            <Link to='/charts/line'>
                                <LineChartOutlined />
                                折线图
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/bar">
                            <Link to='/charts/bar'>
                                <BarChartOutlined />
                                柱状图
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/pie">
                            <Link to='/charts/pie'>
                                <PieChartOutlined />
                                饼图
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>

        )
    }
}

/*
    withRouter高阶组件：
    包装非路由组件，返回一个新的组件
    新的组件向非路由组件传递三个属性：history/locaiton/match
*/

export default withRouter(LeftNav);