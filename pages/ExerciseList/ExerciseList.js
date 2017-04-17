/**
 * Created by ares5 on 2017/2/13.
 */
var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {

    },
    onLoad: function (option) {
        wx.showNavigationBarLoading();
        let vm = this;
        if(!option.courseId){
            return;
        }else{
            vm.data.courseId = option.courseId;
        }
        vm.setData(vm.data);
    },
    onShow:function () {
        let vm = this;
        DataService('queryCourseExerciseListByCourseId',{courseId:vm.data.courseId}).then(function (response) {
            wx.hideNavigationBarLoading();
            console.log(response);
            vm.data.exerciseList = response;
            vm.setData(vm.data);
        },function () {
            wx.hideNavigationBarLoading();
            wx.showModal({
                title: '查询失败',
                content: '与服务器通信失败',
                success: function(res) {
                    "use strict";

                }
            })
        })
    }
});