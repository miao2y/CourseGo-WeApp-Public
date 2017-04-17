/**
 * Created by ares5 on 2017/2/13.
 */
var app = getApp();
const DataService = require('../../module/Tools.js');
const AV = require('../../libs/av-weapp.js');
Page({
    data: {
        form:{}
    },
    onLoad: function (option) {
        const user = AV.User.current();
        // //如果手机已经完成绑定。。。
        // if(user.getMobilePhoneNumber() != undefined && user.get('mobilePhoneVerified')){
        //     DataService('checkHasBasicInformation').then(function (response) {
        //         console.log(response);
        //         if(!response.hasBasicInformation){
        //             wx.redirectTo({
        //                 url:'../fillData/fillData',
        //                 fail:function (error) {
        //                     console.log(error);
        //                 },
        //                 success:function () {
        //                     console.log('adwad');
        //                 }
        //             });
        //         }else{
        //             wx.switchTab({
        //                 url: '../dashboard/dashboard'
        //             });
        //         }
        //     });
        // }
    },
    onShow:function () {
        let vm = this;
    },
    goToRegister:function () {
        wx.navigateTo({
            url:'../BindTelephone/BindTelephone',
            success:function () {
                "use strict";
            }
        })
    },
    setAccount:function (e) {
        let vm = this;
        vm.data.form.account = e.detail.value;
        vm.setData(vm.data);
    },
    setPassword:function (e) {
        let vm = this;
        vm.data.form.password = e.detail.value;
        vm.setData(vm.data);
    },
    login:function () {
        let vm = this;
        // 首先，使用用户名与密码登录一个已经存在的用户
        AV.User.logInWithMobilePhone(vm.data.form.account, vm.data.form.password).then(user => {
            // 将当前的微信用户与当前登录用户关联
            vm.data.isSuccess = true;
            vm.setData(vm.data);
            console.log('登陆成功');
            return user.linkWithWeapp();
        }, function (error) {
            "use strict";
            vm.data.isSuccess = false;
            vm.setData(vm.data);

            if(error.code == 211){
                wx.showModal({
                    title: '登陆失败',
                    content: '找不到该用户',
                    showCancel: false,
                    success: function (res) {

                    }
                });
                return;
            }else if(error.code == 210){
                wx.showModal({
                    title: '登陆失败',
                    content: '用户名与密码不匹配',
                    showCancel: false,
                    success: function (res) {

                    }
                });
                return;
            }else if(error.code == 219){
                wx.showModal({
                    title: '登陆失败',
                    content: '您的登陆次数过多，请稍后再试',
                    showCancel: false,
                    success: function (res) {

                    }
                });
                return;
            }
            wx.showModal({
                title: '注意',
                content: '您的微信号已绑定其他账号，如有问题请练习在线客服',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }).then(function (resolve) {
            if(vm.data.isSuccess){
                wx.switchTab({
                    url: '../dashboard/dashboard'
                });
            }else{

            }
            "use strict";

        },function (error) {
            "use strict";

        });
    }
});