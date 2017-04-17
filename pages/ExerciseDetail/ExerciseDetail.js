/**
 * Created by ares5 on 2017/2/13.
 */
var app = getApp();
var sliderWidth = 96;
const DataService = require('../../module/Tools.js');
Page({
    data: {
        tabs: ["基本信息", "学生答题情况", "题目完成情况"],
        activeIndex: "0",
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function (option) {
        wx.showNavigationBarLoading();
        let vm = this;
        console.log(option);
        if(!option.exerciseId){
            return;
        }else{
            vm.data.exerciseId = option.exerciseId;
        }
        wx.getSystemInfo({
            success: function(res) {
                vm.setData({
                    sliderLeft: (res.windowWidth / vm.data.tabs.length - sliderWidth) / 2
                });
            }
        });
        console.log(vm.data);
        vm.setData(vm.data);

    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },
    onShow:function () {
        let vm = this;
        wx.showNavigationBarLoading();
        DataService('queryExerciseResultByExerciseId',{exerciseId:vm.data.exerciseId}).then(function (response) {

            //todo:将查询到的数据按照班级分类保存
            //保存所有的班级列表到classGroupList
            let classGroupList = response.exercise.classGroupList;
            let scoreList = [];
            for(let i = 0;i<classGroupList.length;i++){
                scoreList[i] = {};
                scoreList[i].classGroupName = classGroupList[i].name;
                scoreList[i].id = classGroupList[i].id;
                scoreList[i].score = [];
            }
            //遍历exerciseScoreList
            for(let i = 0;i<response.exerciseScoreList.length;i++){
                let row = response.exerciseScoreList[i];
                //遍历scoreList 填进对应数组中
                for(let j = 0;j<scoreList.length;j++){
                    if(scoreList[j].classGroupName == row.student.classGroupName){
                        scoreList[j].score.push(row);
                    }
                }
            }
            app.globalData.scoreList = scoreList;
            wx.hideNavigationBarLoading();
            console.log(response);



            vm.data.questionList = response.questionList;
            //questionListOnScreen为最终显示在屏幕上的内容，分离便于查找
            vm.data.questionListOnScreen = vm.data.questionList;
            //设置全局数据，便于前往试题详情
            app.globalData.questionList = vm.data.questionList;
            vm.data.exerciseInfo = response.exercise;
            vm.data.averageScore = response.averageScore;
            vm.data.exerciseScoreList = response.exerciseScoreList;
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
    }
});