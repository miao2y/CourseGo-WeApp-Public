/**
 * Created by ares5 on 2017/2/13.
 */
var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        state:0,
        form:[]
    },
    onLoad: function (option) {
        let vm = this;
        wx.showNavigationBarLoading();
        if(!option.exerciseId){
            return;
        }else{
            vm.data.exerciseId = option.exerciseId;
        }
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration:10000
        });
        DataService('attendExercise',{exerciseId:option.exerciseId}).then(function (response) {
            console.log(response);
            for(let i = 0;i<response.questionList.length;i++){
                response.questionList[i].answer = [];
            }
            vm.data = response;
            vm.data.form = vm.data.questionList;
            vm.data.state = 0;
            vm.data.length = vm.data.questionList.length;
            vm.data.question = vm.data.questionList[vm.data.state];
            if(vm.data.question.type == '填空'){
                vm.data.question.fields = [];
                for(let i = 0;i<vm.data.question.numOfField;i++){
                    vm.data.question.fields.push({});
                }
            }
            vm.data.question.answer = [];
            vm.data.time = 0;
            vm.data.interval = setInterval(function () {
                vm.data.time++;
                console.log(vm.data.time);
                vm.setData(vm.data);
            },1000);
            wx.hideToast();
            vm.setData(vm.data);
        },function (error) {
            console.log(error);
        });
        vm.setData(vm.data);
    },
    onShow:function () {
        let vm = this;
        wx.hideNavigationBarLoading();

    },
    nextQuestion:function () {
        let vm = this;
        vm.data.question = vm.data.questionList[++vm.data.state];
        if(vm.data.question.type == '填空'){
            vm.data.question.fields = [];
            for(let i = 0;i<vm.data.question.numOfField;i++){
                vm.data.question.fields.push({});
            }
        }
        vm.setData(vm.data);
    },
    previousQuestion:function () {
        let vm = this;
        vm.data.question = vm.data.questionList[--vm.data.state];
        vm.setData(vm.data);
    },
    radioChange:function (e) {
        let vm = this;
        //单选题绑定checked
        for(let i = 0;i < vm.data.question.choiceList.length ; i++){
            let row = vm.data.question.choiceList[i];
            if(row.label == e.detail.value){
                vm.data.question.choiceList[i].checked = true;
            }else{
                vm.data.question.choiceList[i].checked = false;
            }
        }
        vm.data.question.answer = [];
        vm.data.question.answer.push(e.detail.value);
        //将vm.data.question更新至vm.data.questionList;
        vm.data.questionList[vm.data.state] = vm.data.question;
        vm.setData(vm.data);
    },
    checkboxChange:function (e) {
        let vm = this;
        //多选题答案绑定
        for(let i = 0;i < vm.data.question.choiceList.length ; i++){
            let row = vm.data.question.choiceList[i];
            row.checked = false;
            //遍历所有选项 再遍历所有答案  如果是符合的checked = true
            for(let j = 0;j<e.detail.value.length;j++){
                if(row.label == e.detail.value[j]){
                    row.checked = true;
                }
            }
            vm.data.question.choiceList[i] = row;
        }
        vm.data.question.answer = e.detail.value;
        vm.data.questionList[vm.data.state] = vm.data.question;
        vm.setData(vm.data);
    },
    judgeChange:function (e) {
        //判断题答案绑定
        let vm = this;
        if(e.detail.value == '正确'){
            vm.data.question.answer = [];
            vm.data.question.answer.push('正确');
        }else{
            vm.data.question.answer = [];
            vm.data.question.answer.push('错误');
        }
        vm.data.questionList[vm.data.state] = vm.data.question;
        vm.setData(vm.data);
        console.log(vm.data.questionList[vm.data.state]);
    },
    inputChange:function (e) {
        //填空题答案绑定
        let vm = this;
        //todo:绑定填空题输入
        vm.data.question.answer[e.currentTarget.id] = e.detail.value;
        vm.data.questionList[vm.data.state] = vm.data.question;
        vm.setData(vm.data);
        console.log(vm.data.questionList);
    },
    submit:function () {
        let vm = this;
        let answerList = [];
        let unFinishedQuestion = [];
        for(let i = 0;i<vm.data.questionList.length;i++){
            answerList[i] = {};
            answerList[i].questionId =vm.data.questionList[i].id;
            answerList[i].answer = vm.data.questionList[i].answer;
            ///////////////检查是否完成///////////////////
            switch (vm.data.questionList[i].type){
                case '填空':{
                    let row = vm.data.questionList[i];
                    if(row.numOfField != row.answer.length){
                        unFinishedQuestion.push(i);
                        break;
                    }else{
                        for(let j = 0;j<row.numOfField;j++){
                            if(row.answer[j] == ""){
                                unFinishedQuestion.push(i);
                                break;
                            }
                        }
                        break;
                    }
                }
                case '单选':{
                    let row = vm.data.questionList[i];
                    if(row.answer.length == 0){
                        unFinishedQuestion.push(i);
                    }
                    break;
                }
                case '多选':{
                    let row = vm.data.questionList[i];
                    if(row.answer.length == 0){
                        unFinishedQuestion.push(i);
                        break;
                    }
                }
                case '判断':{
                    let row = vm.data.questionList[i];
                    if(row.answer.length == 0){
                        unFinishedQuestion.push(i);
                        break;
                    }
                }
            }
        }
        let message = "";
        if(unFinishedQuestion.length >0){
            message = '您还有 '+ unFinishedQuestion.length +'题未完成，确定提交?'
        }else{
            message = '确定提交本次练习？'
        }
        wx.showModal({
            title: '注意',
            content: message,
            showCancel: true,
            success: function (res) {
                if(res.confirm){
                    wx.showToast({
                        title: '提交中',
                        icon: 'loading',
                        duration:10000
                    });
                    let form = {};
                    form.exerciseId = vm.data.id;
                    form.time = vm.data.time;
                    form.answerList = answerList;
                    clearInterval(vm.data.interval);
                    DataService('submitExerciseAnswer',form).then(function (response) {
                        console.log(response);
                        wx.showToast({
                            title: '提交成功',
                            icon: 'success',
                            duration:2000,
                            success:function () {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        });
                    }).catch(function (error) {
                        wx.hideToast();
                        wx.showModal({
                            title: '提交失败',
                            content: error.message,
                            showCancel: false,
                            success: function (res) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        });
                    });
                }
                // wx.navigateBack({
                //     delta: 1
                // })
            }
        });
        // return;

    }
});