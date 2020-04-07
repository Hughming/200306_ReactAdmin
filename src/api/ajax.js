/*
发送异步ajax请求的函数模块
封装axios库
函数返回值是promise对象
1. 优化： 统一处理请求
    在外层摆一个自己创建的promise对象
    在请求出错时，不去reject(error)，而是显示错误提示
2.优化： 异步得到的不是response，而是response.data
    在请求成功resolve时，resolve(response.data)
*/

/*
解决跨域：1.协议 2.主机 3.端口号不同
方法：1.jsonp（只能解决get） 2.corx（开发一般不用，后台的事情）3.代理（一般用这个）
*/

import axios from 'axios';
import { message } from 'antd';

export default function ajax (url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        //1.执行异步ajax请求
        if (type === 'GET') { //GET
            promise = axios.get(url, { //配置对象
                params: data
            })
        } else { //POST
            promise = axios.post(url, data)
        }
        //2.如果成功了，调用resolve(value)
        promise.then(response => {
            resolve(response.data);
            //3.如果失败了，不调用reject(reason)，而是提示异常信息
        }).catch(error => {
            message.error('请求出错了：' + error.message);
        })
    })
}

//请求登陆接口
// ajax('/login', { username: 'Tom', password: '12345' }, 'POST').then()
//添加用户
// ajax('/manage/user/add', { username: 'Tom', password: '12345', phone: '13712341234' }, 'POST').then()