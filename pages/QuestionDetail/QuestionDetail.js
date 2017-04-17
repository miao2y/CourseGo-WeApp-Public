/**
 * Created by ares5 on 2017/2/13.
 */
let app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        courseInfo:null
    },
    onLoad:function (option) {
        let vm = this;
        console.log(option);
        if(!option.index){
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
            vm.data.index = option.index;
        }
        vm.data.questionList = app.globalData.questionList;
        vm.data.questionInfo = vm.data.questionList[option.index];
        vm.setData(vm.data);
    },
    deleteQuestion:function () {
        "use strict";
        let vm = this;
        wx.showModal({
            title: '注意',
            content: '您即将从题库中移除本题，确定要继续？',
            showCancel: true,
            success: function (res) {
                "use strict";
                if(res.confirm){
                    wx.showToast({
                        title: '加载中',
                        icon: 'loading',
                        mask:true
                    });
                    vm.data.isLoading = true;
                    vm.setData(vm.data);
                    DataService('deleteQuestionById',{questionId:vm.data.questionInfo.id}).then(function (response) {
                        console.log(response);
                        wx.hideToast();
                        wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 2000,
                            success: function (res) {
                                setTimeout(function(){
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                },2000);
                            }
                        });

                    },function (error) {
                        vm.data.isLoading = false;
                        vm.setData(vm.data);
                        wx.hideToast();
                        wx.showModal({
                            title: '删除失败',
                            content: '与服务器通信失败',
                            showCancel: false
                        });
                    });
                }else{

                }
            }
        });
    }
});