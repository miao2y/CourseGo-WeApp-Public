let app = getApp();
const DataService = require('../../module/Tools.js');
const AV = require('../../libs/av-weapp.js');
function isEmail(str){
    let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    return reg.test(str);
}

Page({
    data: {
        userTypeAnimation:'',
        numberName:'',
        formAnimation:'',
        passwordCheckCondition:true,
        firstCheckPassword:true,
        step:0,
        windowWidth:wx.windowWidth,
        windowHeight:wx.windowHeight,
        schoolList:null,
        form:{
            type:null,
            email:null,
            legalName:null,
            schoolId:null,
            password:null,
            confirmPassword:null,
            number:null
        }
    },
    onLoad: function () {
        DataService('querySchoolList',{}).then((result) => {
            this.data.schoolList = result;
            console.log(result[0].name);
            this.setData(this.data);
        }).catch((error) => {
            if(error.code == 215){
                wx.showModal({
                    title: '获取失败',
                    content: "您还未认证手机号，请认证后继续",
                    showCancel: false,
                    success: function (res) {
                        wx.redirectTo({
                            url:'../index/index'
                        });
                    }
                });
                return;
            }
            wx.showModal({
                title: '获取失败',
                content: "获取学校列表失败，请退出后重试",
                showCancel: false,
                success: function (res) {

                }
            });
        })

    },
    onShow:function () {

    }
    ,
    onReady:function () {
        // this.data.animation = animate;
        // this.data.animation.scale(2,2).rotate(45).step();
        // this.setData(this.data);
    },
    //userType选择学生
    chooseStudent:function () {
        this.data.step = 1;
        this.data.numberName = '学号';
        this.data.form.type = 'student';
        this.setData(this.data);
    },
    //userType选择教师
    chooseTeacher:function () {
        this.data.step = 1;
        this.data.numberName = '教工号';
        this.data.form.type = 'teacher';
        this.setData(this.data);
    },
    //密码Setter
    setPassword:function (e) {
        this.data.form.password = e.detail.value;
        if(!this.data.firstCheckPassword){
            this.checkPassword();
        }
        this.setData(this.data);
    },
    //检查密码
    checkPassword:function () {
        console.log('检查密码');
        this.data.firstCheckPassword = false;
        if(this.data.form.confirmPassword != this.data.form.password){
            this.data.passwordCheckCondition = false;
            this.setData(this.data);
        }else{
            this.data.passwordCheckCondition = true;
            this.setData(this.data);
        }
    },
    //确认密码Setter
    setConfirmPassword:function (e) {
        this.data.form.confirmPassword = e.detail.value;
        this.setData(this.data);
        if(!this.data.firstCheckPassword){
            this.checkPassword();
        }
    },
    //姓名Setter
    setLegalName:function (e) {
        this.data.form.legalName = e.detail.value;
        this.setData(this.data);
    },
    //学号/教工号Setter
    setNumber:function (e) {
        this.data.form.number = e.detail.value;
        this.setData(this.data);
    },
    //Email Setter
    setEmail:function (e) {
        this.data.form.email = e.detail.value;
        this.setData(this.data);
    },
    //学校Setter
    setSchool:function (e) {
        this.data.form.schoolId = this.data.schoolList[e.detail.value].id;
        this.data.schoolName = this.data.schoolList[e.detail.value].name;
        console.log(e.detail.value);
        this.setData(this.data);
    },
    //提交注册
    submitBasicInformation:function () {
        //todo:禁用Submit按钮

        let form = this.data.form;
        //检查密码是否填写
        if(form.password == '' || !form.password) {
            wx.showModal({
                title: '注册失败',
                content: "您尚未输入密码",
                showCancel: false,
                success: function (res) {
                }
            });
            return;
        }
        //检查密码是否相同
        if(form.password != form.confirmPassword){
            wx.showModal({
                title: '注册失败',
                content: "您两次输入的密码不一致",
                showCancel: false,
                success: function (res) {
                }
            });
            return;
        }
        //检查真实姓名是否填写
        if(form.legalName == '' || !form.legalName){
            wx.showModal({
                title: '注册失败',
                content: "您还未填写真实姓名",
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        //检查学号/教工号是否填写
        if(form.number == '' || !form.number){
            wx.showModal({
                title: '注册失败',
                content: "您还未填写" + this.data.numberName,
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        //检查电子邮件是否填写
        if(form.email == '' || !form.email){
            wx.showModal({
                title: '注册失败',
                content: "您尚未输入邮箱",
                showCancel: false,
                success: function (res) {
                }
            });
            return;
        }
        //检查电子邮件是否格式正确
        if(!isEmail(form.email)){
            wx.showModal({
                title: '注册失败',
                content: "您输入的邮件格式有误，请检查",
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        //检查学校是否选择
        if(form.schoolId == '' || !form.schoolId){
            wx.showModal({
                title: '注册失败',
                content: "您尚未选择学校",
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        //提交密码
        const user = AV.User.current();
        user.set('password', form.password);
        user.save().then(function (result) {
            AV.User.loginWithWeapp().then(user => {
              "use strict";
              DataService('submitBasicInformation',form).then(function (result) {
                  wx.navigateTo({
                      url:'../dashboard/dashboard',
                      success:function () {
                          console.log('跳转成功')
                      }
                  })
              })
            }).catch(function (error) {
                wx.showModal({
                    title: '注册失败',
                    content: "注册失败,请稍后再试",
                    showCancel: false,
                    success: function (res) {

                    }
                });
            });
        });
    },
    reChooseType:function () {
        this.data.step = 0;
        this.setData(this.data);
    },


});
