/**
 * Created by ares5 on 2017/2/13.
 */
let app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        courseInfo:null
    },
    searchQuestion:function (inputVal) {
        let vm = this;
        console.log(inputVal);
        if(inputVal == ""){
            return vm.data.questionList;
        }
        let array = [];
        let length = vm.data.questionList.length;
        for(let i = 0; i < length ;i++){
            let row = vm.data.questionList[i];
            let isPushed = false;
            if(row.topic.indexOf(inputVal) >= 0){
                array.push(row);
                isPushed = true;
            }else if(row.type.indexOf(inputVal) >= 0){
                array.push(row);
                isPushed = true;
            }else if(row.rightAnswerSorted.indexOf(inputVal) >= 0){
                array.push(row);
                isPushed = true;
            }else{
                for(let j = 0; j < row.choiceList.length ; j++){
                    if(row.choiceList[j].value.indexOf(inputVal) >= 0){
                        array.push(row);
                        isPushed = true;
                        break;
                    }
                }
            }
            if(!isPushed){
                for(let j = 0; j < row.tags.length ; j++){
                    if(row.tags[j].indexOf(inputVal) >= 0){
                        array.push(row);
                        isPushed = true;
                        break;
                    }
                }
            }
        }
        return array;
    },
    onLoad:function (option) {
        let vm = this;
        if(option.courseId){
            vm.data.courseId = option.courseId;
        }else{
            wx.showModal({
                title: '查询失败',
                content: '未找到课程编号',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1
                    });
                }
            });
        }
    },
    onShow:function () {
        let vm = this;
        wx.showNavigationBarLoading();
        DataService('queryQuestionListByCourseId',{courseId:vm.data.courseId}).then(function (response) {
            console.log(response);
            vm.data.questionList = response;
            //设定全局数据
            app.globalData.questionList = response;
            //显示用的questionList,便于之后查找
            vm.data.questionListOnScreen = vm.data.questionList;
            wx.hideNavigationBarLoading();
            vm.setData(vm.data);
        },function (error) {
            wx.hideNavigationBarLoading();
            wx.showModal({
                title: '查询失败',
                content: '与服务器通讯失败',
                showCancel: false,
                success: function (res) {
                    "use strict";

                }
            });
        })
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
        vm.data.questionListOnScreen = vm.searchQuestion("");
        vm.setData(vm.data);
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        let vm = this;
        vm.data.questionListOnScreen = vm.searchQuestion("");
        vm.setData(vm.data);
    },
    inputTyping: function (e) {
        let vm = this;
        vm.data.inputVal = e.detail.value;
        vm.data.questionListOnScreen = vm.searchQuestion(e.detail.value);
        vm.setData(vm.data);
    },
    goToQuestionDetail:function (e) {
        
    }

});
