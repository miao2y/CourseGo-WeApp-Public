/**
 * Created by ares5 on 2017/2/13.
 */
var app = getApp();
const AV = require('../../libs/av-weapp.js');
const DataService = require('../../module/Tools.js');
const Interval = require('../../module/Interval.js');
Page({
    data: {

    },
    onLoad: function () {
        let that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
            //更新数据
            that.setData({
                userInfo:userInfo
            });
        });
    },
    onShow:function () {
        const user = AV.User.current();
        if(user.getMobilePhoneNumber() != undefined && user.get('mobilePhoneVerified')){
            DataService('checkHasBasicInformation').then(function (response) {
                console.log(response);
                //如果当前微信账户已经有账号，但是还没有填写基本信息，则进入fillData
                if(!response.hasBasicInformation){
                    wx.redirectTo({
                        url:'../fillData/fillData',
                        fail:function (error) {
                            console.log(error);
                        },
                        success:function () {
                            console.log('adwad');
                        }
                    });
                }else{
                    //如果当前微信账户已经有账号，并且已经填写了基本信息，则进入dashboard
                    wx.showModal({
                        title: '注意',
                        content: '您的微信已经绑定账号，请直接登陆',
                        showCancel: false,
                        success: function (res) {
                            wx.switchTab({
                                url: '../dashboard/dashboard'
                            });
                        }
                    });
                }
                //如果没有账号则填写手机号注册
            });
        }
    },
    //手机号Setter
    setTelephone:function (e) {
        this.data.telephone = e.detail.value;
        this.setData(this.data);
    },
    //手机号getter
    getTelephone:function () {
        return this.data.telephone;
    },
    //验证码Setter
    setCode:function (e) {
        this.data.code = e.detail.value;
        this.setData(this.data);
    },
    //发送验证码
    bindSendCodeTap: function () {
        //如果为空，则弹出dialog
        if(this.data.telephone == null){
            wx.showModal({
                title: '发送失败',
                content: '请输入您的手机号',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        //显示计时器
        this.data.isSentCode = true;
        this.setData(this.data);
        //通过验证则发送请求，检查是否占用
        DataService('checkTelephoneIsUsed',{telephone:this.data.telephone}).then((result) => {
            //如果被占用，即弹出Dialog，结束下一步动作
            if(result.isUsed){
                wx.showModal({
                    title: '发送失败',
                    content: '您输入的手机号已被占用',
                    showCancel: false,
                    success: function (res) {

                    }
                });
                return;
            }
            //绑定手机号
            const user = AV.User.current();
            // //如果当前用户已经绑定了手机号并且与输入的号码不符
            // if(user.getMobilePhoneNumber() != undefined && user.getMobilePhoneNumber() != this.data.telephone && user.get('mobilePhoneVerified')){
            //     wx.showModal({
            //         title: '发送失败',
            //         content: '该账号已绑定其他手机号',
            //         showCancel: false,
            //         success: function (res) {
            //
            //         }
            //     });
            //     return;
            // }

            user.setMobilePhoneNumber(this.data.telephone);
            user.save();
            AV.User.requestMobilePhoneVerify(user.getMobilePhoneNumber());

            //设置定时器,60秒后可以再次发送
            let interval_60 = new Interval(60000,1000);
            interval_60.start( () => {
                //每隔一段时间执行
                this.data.isSentCode = true;
                this.data.timeLeft = interval_60.timeLeft/1000;
                this.setData(this.data);
            },() => {
                //定时器自动销毁时执行
                this.data.isSentCode = false;
                this.setData(this.data);
            });
        },(error) => {
            let errorInfo = "";
            if(error.code == 1){
                errorInfo = "手机号格式有误，请检查您的手机号格式是否正确";
            }else{
                errorInfo = "发送验证码失败，请稍后再试";
            }
            wx.showModal({
                title: '发送失败',
                content: errorInfo,
                showCancel: false,
                success: function (res) {

                }
            });
        });
    },
    bindTelephone :function () {
        if(this.data.code == null){
            wx.showModal({
                title: '认证失败',
                content: '您还未输入验证码',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        console.log(this.data.code);
        AV.User.verifyMobilePhone(this.data.code).then(function(result){
            console.log(result);
            wx.navigateTo({
                url:'../fillData/fillData',
                success:function () {
                    console.log('跳转成功')
                }
            })
        }, function(err){
            wx.showModal({
                title: '认证失败',
                content: '验证码错误，请稍后重试',
                showCancel: false,
                success: function (res) {

                }
            });
        });
    }
});