var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        messageList : []
    },
    onLoad: function (option) {
        "use strict";
        let vm  = this;
        console.log(option);
        if(!option.courseId){
            wx.showModal({
                title: '查询失败',
                content: '未找到课程编号',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            });
            return;
        }else{
            vm.data.courseId = option.courseId;
            vm.setData(vm.data);
        }
        wx.showToast({
            title: '加载中',
            icon: 'loading'
        });
        DataService('queryCourseNoticeListByCourseId',{courseId:option.courseId}).then(function (response) {
            console.log(response);
            vm.data.messageList = response;
            console.log(vm.data.messageList);
            vm.setData(vm.data);
            wx.hideToast();
        },function (error) {
            wx.hideToast();
            wx.showModal({
                title: '查询失败',
                content: '与服务器通讯失败',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            });
        })
    },
    onShow:function () {
        let vm = this;
    }
});