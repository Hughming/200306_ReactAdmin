import React, { Component } from 'react'
import './index.less'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'
import LinkButton from '../link-button'
/*
左侧导航的组件
*/

class Header extends Component {

    state = {
        currentTime: formatDate(Date.now()), //时间
        dayPictureUrl: '', //天气图片url
        weather: '', //天气文本
    }

    getTime = () => {
        //每隔一秒获取当前时间，并更新
        this.intervalID = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('北京')
        this.setState({ dayPictureUrl, weather })
    }

    getTitle = () => {
        const path = this.props.location.pathname;
        let title = '';
        if (path === '/home') {
            title = '首页';
        } else if (path === '/category') {
            title = '品类管理';
        } else if (path === '/product') {
            title = '商品管理';
        } else if (path === '/user') {
            title = '用户管理';
        } else if (path === '/role') {
            title = '权限管理';
        } else if (path === '/charts/pie') {
            title = '饼状图';
        } else if (path === '/charts/bar') {
            title = '柱状图';
        } else if (path === '/charts/line') {
            title = '折线图';
        }
        return title;
    }

    /*
    推出登陆
    */
    logout = () => {
        Modal.confirm({
            content: '确定退出吗？',
            onOk: () => {
                //console.log('OK');
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到login
                this.props.history.replace('/login')
            }
        })
    }

    componentDidMount () {
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
    }

    componentWillUnmount () {
        //清楚定时器
        clearInterval(this.intervalID)
    }

    render () {
        const { currentTime, dayPictureUrl, weather } = this.state

        const username = memoryUtils.user.username

        const title = this.getTitle()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"></img>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)