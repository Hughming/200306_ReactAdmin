/*
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/
import jsonp from "jsonp";
import ajax from './ajax'
import { message } from "antd";

//登陆
/*export function reqLogin (username, password) {
    return ajax('/login', { username, password }, 'POST')
}*/

var BASE = ''

export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST');

//添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST');

//获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId }, 'GET')
//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')
//更新分类的名称
export const reqUpdateCategory = ({ categoryId, categoryName, }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')
//获取分类名称
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

//更新商品状态
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

//搜索商品分页列表
//searchType: productName/productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

//删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

//jsonp请求的接口请求函数
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        //发送jsonp请求
        jsonp(url, {}, (err, data) => {
            //console.log('jsonp()', err, data)
            //如果成功
            if (!err && data.status === 'success') {
                //取出需要的数据
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather })
            } else {
                //如果失败了
                message.error('获取天气信息失败！')
            }
        })
    })

}


