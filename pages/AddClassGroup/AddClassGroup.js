var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        courseList:[],
        form:{}
    },
    onLoad: function (option) {
        "use strict";
        let vm = this;
        if(!option.courseId){
            wx.showModal({
                title: '查询失败',
                content: '未找到相关信息',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1
                    });
                }
            });
        }else{
            vm.data.courseId = option.courseId;
            vm.data.courseList = app.globalData.allCourseList;
        }
    },
    onShow:function () {
        let vm = this;
        wx.showNavigationBarLoading();
        if(!app.globalData.allCourseList){
            DataService('queryCourseById',{courseId:vm.data.courseId}).then(function (response) {
                vm.data.course = response;
                vm.setData(vm.data);
            },function (error) {
                "use strict";
                wx.hideNavigationBarLoading();
            });
        }
        for(let i = 0;i<vm.data.courseList.length;i++){
            if(vm.data.courseList[i].id == vm.data.courseId){
                vm.data.course = vm.data.courseList[i];
                break;
            }
        }
        vm.setData(vm.data);
    },
    radioChange:function (e) {
        let vm = this;
        console.log(e.detail.value);
        vm.data.form.classGroupId = e.detail.value;
        for(let i = 0;i<vm.data.course.classGroupList.length;i++){
            if(vm.data.course.classGroupList[i].id == e.detail.value){
                vm.data.course.classGroupList[i].checked = true;
            }else{
                vm.data.course.classGroupList[i].checked = false;
            }
        }
        vm.setData(vm.data);
    },
    submit:function (e) {
        let vm = this;
        if(!vm.data.form.classGroupId){
            wx.showModal({
                title: '注意',
                content: '您尚未选择该课程中的班级',
                showCancel: false,
                success: function (res) {
                    "use strict";
                }
            });
        }
        vm.data.form.courseId = vm.data.courseId;
        vm.data.isLoading = true;
        vm.setData(vm.data);
        wx.showToast({
            title: '加入中',
            icon: 'loading',
            duration:10000
        });
        DataService('attendCourse',vm.data.form).then(function (response) {
            wx.showToast({
                title: '加入成功',
                icon: 'success',
                duration:2000
            });
            setTimeout(function () {
                wx.navigateBack({
                    delta: 2
                });
            },2000)
        },function (error) {
            wx.showModal({
                title: '操作失败',
                content: '无法与服务器连接',
                showCancel: false,
                success: function (res) {
                    "use strict";
                    vm.data.isLoading = false;
                    vm.setData(vm.data);
                }
            });
        })
    }
});