var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        courseList:[]
    },
    onLoad: function (option) {
        "use strict";
    },
    onShow:function () {
        let vm = this;
        wx.showNavigationBarLoading();
        DataService('queryGoingCourseList',{}).then(function (response) {
            wx.hideNavigationBarLoading();
            vm.data.courseList = response;
            vm.setData(vm.data);
        },function (error) {
            "use strict";
            wx.hideNavigationBarLoading();
        });

    }
});