import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './login.less'
import logo from '../../assets/imgs/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

/*
 login router component
*/

class Login extends Component {
    formRef = React.createRef();

    handleSubmit = (event) => {
        this.formRef.current.validateFields(['username', 'password']).then(async (value) => {
            const { username, password } = value;
            const result = await reqLogin(username, password);
            //console.log("success", response);
            //const result = response.data; // {status: 0, data: user} {status: 1, msg: 'xxx'}
            if (result.status === 0) { //登陆成功
                message.success('登陆成功');
                //跳转到后台管理界面

                //保存user
                const user = result.data;
                memoryUtils.user = user; //保存在内存中
                storageUtils.saveUser(user); //保存在local中

                this.props.history.replace('/')

            } else { //登陆失败
                message.error(result.msg);
            }
        }).catch(error => {
            console.log('检验失败：' + error);
        });
    }

    /*
    对密码进行自定义验证
    */
    validatePwd = (rule, value) => {
        /*
        自定义校验：
            密码的合法性要求：
            1）必须输入
            2）必须大于等于4位
            3）必须小于等于12位
            4）必须是英文/数字或下划线的组合
        */
        //console.log('validatePwd()', rule, value);
        if (!value) {
            return Promise.reject("密码必须输入");
        } else if (value.length < 4) {
            return Promise.reject("密码至少4位");
        } else if (value.length > 13) {
            return Promise.reject("密码至多12位");
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject("密码必须是数字、字母和下划线的组合");
        } else {
            return Promise.resolve();
        }
    }

    render () {
        //如果用户已经登陆，自动跳转到管理界面
        const user = memoryUtils.user;
        if (user && user._id) {
            return <Redirect to='/'></Redirect>
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt='logo'></img>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        ref={this.formRef}
                        onFinish={this.handleSubmit}
                    >
                        {
                            /*
                            声明式验证：直接使用别人定义好的验证规则进行验证
                                用户名的合法性要求：
                                1）必须输入
                                2）必须大于等于4位
                                3）必须小于等于12位
                                4）必须是英文/数字或下划线的组合
                            */
                        }
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '用户名必须输入' },
                                { min: 4, message: '用户名至少4位' },
                                { max: 12, message: '用户名至多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是数字、字母和下划线的组合' }
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    validator: this.validatePwd
                                }
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Login;

/*
1.前台表单验证
2.收集表单输入数据
*/

/*
async和await
1.作用？
    简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
    以同步编码方式（没有回调函数）实现异步流程

2.那里用await？
    在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据

3.那里用async？
    await所在韩式（最近的）定义的左侧写async
*/