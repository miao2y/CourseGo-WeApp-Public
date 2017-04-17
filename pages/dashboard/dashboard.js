/**
 * Created by ares5 on 2017-01-23.
 */
let app = getApp();
const AV = require('../../libs/av-weapp.js');
const DataService = require('../../module/Tools.js');
const Interval = require('../../module/Interval.js');
Page({
    data: {

    },
    onLoad: function () {
        let vm = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration:10000
        });
        AV.User.loginWithWeapp().then(user => {
            app.globalData.user = user.toJSON();
            DataService('checkHasBasicInformation').then(function (response) {
                console.log(response);
                if(!response.hasBasicInformation){
                    wx.redirectTo({
                        url:'../Login/Login',
                        fail:function (error) {
                            console.log(error);
                        },
                        success:function () {
                            console.log('adwad');
                        }
                    });
                }
            });
        }).catch(function (error) {
            console.error(error);
        });
        const user = AV.User.current();

        app.globalData.user = user;
        vm.data.user = user;
        vm.data.userType = user.get('type');
        console.log(user.get('type'));
    },
    onShow:function () {
        let vm = this;
        console.log(vm.data.user.get('type'));
        DataService('queryGoingCourseTimeLineList',{}).then(function (response) {
            console.log(response);
            vm.data.timeLine = response;
            wx.hideToast();
            vm.setData(vm.data);
        });
    }
});