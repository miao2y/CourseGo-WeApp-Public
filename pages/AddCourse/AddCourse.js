var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        courseList:[]
    },
    onLoad: function (option) {
        "use strict";
        wx.showNavigationBarLoading();
    },
    onShow:function () {
        let vm = this;
        DataService('searchCourseByKeywordList',{keywordList:[]}).then(function (response) {
            wx.hideNavigationBarLoading();
            vm.data.courseList = response;
            app.globalData.allCourseList = response;
            vm.setData(vm.data);
        },function (error) {
            "use strict";
            wx.hideNavigationBarLoading();
        });
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
        let vm = this;
        vm.data.inputVal = "";
        vm.setData(vm.data);
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        let vm = this;
        vm.data.inputVal = "";
        vm.setData(vm.data);
    },
    inputTyping: function (e) {
        let vm = this;
        console.log(vm.data.inputVal);
        vm.data.inputVal = e.detail.value;
        vm.setData(vm.data);
    },
    goToQuestionDetail:function (e) {

    },
    search:function () {
        let vm = this;
        //分割关键字
        let keywordList = [vm.data.inputVal];
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration:10000
        });
        DataService('searchCourseByKeywordList',{keywordList:keywordList}).then(function (response) {
            wx.hideNavigationBarLoading();
            vm.data.courseList = response;
            vm.setData(vm.data);
            wx.hideToast();
        },function (error) {
            "use strict";
            wx.hideNavigationBarLoading();
            wx.hideToast();
        });


    }
});