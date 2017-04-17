var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {

    },
    onLoad: function (option) {
        wx.showNavigationBarLoading();
        let vm = this;
        if(!option.classGroupName){
            return;
        }else{
            vm.data.classGroupName = option.classGroupName;
        }
        console.log(vm.data.classGroupName);
        console.log(app.globalData);
        vm.setData(vm.data);
    },
    onShow:function () {
        let vm = this;
        wx.hideNavigationBarLoading();
        for(let i = 0;i < app.globalData.scoreList.length;i++){
            if(app.globalData.scoreList[i].classGroupName == vm.data.classGroupName){
                vm.data.scoreList = app.globalData.scoreList[i];
            }
        }
        console.log(vm.data.scoreList);
        vm.setData(vm.data);
        // DataService('queryCourseExerciseListByCourseId',{courseId:vm.data.courseId}).then(function (response) {
        //     wx.hideNavigationBarLoading();
        //     console.log(response);
        //     vm.data.exerciseList = response;
        //     vm.setData(vm.data);
        // },function () {
        //     wx.hideNavigationBarLoading();
        //     wx.showModal({
        //         title: '查询失败',
        //         content: '与服务器通信失败',
        //         success: function(res) {
        //             "use strict";
        //
        //         }
        //     })
        // })
    }
});