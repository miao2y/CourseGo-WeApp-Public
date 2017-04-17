const DataService = require('../../module/Tools.js');
const AV = require('../../libs/av-weapp.js');

let app = getApp();
Page({
    data: {
        courseInfo:null
    },
    onLoad: function (option) {
        let vm = this;
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
        }
        //获取用户信息
        console.group('app全局数据');
        console.log(app.globalData);
        console.groupEnd();
        vm.data.user = AV.User.current();
        vm.data.userType = vm.data.user.get('type');
        vm.setData(vm.data);
        DataService('queryCourseById',{courseId:option.courseId}).then(function (response) {
            vm.data.courseInfo = response;
            vm.data.courseInfo.beginDate = new Date().Format("yyyy年MM月dd日");
            vm.data.courseInfo.endDate = new Date().Format("yyyy年MM月dd日");
            app.globalData.course[option.courseId] = response;
            console.log(response);
            vm.setData(vm.data);
        },function (error) {
            console.log(error);
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
        console.log('OnShow');
        let vm = this;
        vm.data.windowWidth = wx.windowWidth;
        vm.setData(vm.data);
    },
    show:function () {
        console.log('你好啊唯物主义者');
    }
});
