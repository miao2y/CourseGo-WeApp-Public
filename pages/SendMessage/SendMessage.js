let app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {
        form:{

        },
        step:null
    },
    onLoad: function (option) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration:10000
        });
        let vm = this;
        if(!option.courseId){
            ///////////////////若从首页打开///////////////////
            vm.data.ShouldSelectCourse = true;
            DataService('queryGoingCourseList').then(function (response) {
                wx.hideToast();
                vm.data.courseList = response;
                //默认值 设置form中的courseId
                vm.data.courseInfo = response[0];
                vm.data.form.courseId = vm.data.courseInfo.id;
                console.log(response);
                vm.setData(vm.data);
            },function (error) {
                wx.hideToast();
                wx.showModal({
                    title: '注意',
                    content: '与服务器通信失败',
                    showCancel: false,
                    success: function (res) {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            });
        }else{
            ///////////////////若从课程详情打开///////////////////
            vm.data.ShouldSelectCourse = false;
            //设置form中的courseId
            vm.data.form.courseId = option.courseId;
            DataService('queryCourseById',{courseId:option.courseId}).then(function (response) {
                wx.hideToast();
                vm.data.courseInfo = response;
                console.log(response);
                app.globalData.course[option.courseId] = response;
                vm.setData(vm.data);
            },function (error) {
                wx.hideToast();
                wx.showModal({
                    title: '注意',
                    content: '与服务器通信失败',
                    showCancel: false,
                    success: function (res) {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            });
        }
    },
    onShow:function () {
        let vm = this;
        vm.data.step = 1;
        vm.setData(vm.data);
    },
    bindChooseCourseChange:function (e) {
        let vm = this;
        vm.data.courseInfo = vm.data.courseList[e.detail.value];
        vm.setData(vm.data);
        DataService('queryCourseById',{courseId:vm.data.courseInfo.id}).then(function (response) {
            vm.data.courseInfo = response;
            app.globalData.course[vm.data.form.courseId] = response;
            //安全起见将form清空
            vm.data.form = {};
            //设置form中的courseId
            vm.data.form.courseId = vm.data.courseInfo.id;
            vm.setData(vm.data);
        },function (error) {
            wx.showModal({
                title: '注意',
                content: '与服务器通信失败',
                showCancel: false,
                success: function (res) {
                    wx.navigateBack({
                        delta: 1
                    });
                }
            });
        });
    },
    chooseClassGroupChange:function (e) {
        let vm = this;
        console.log(e.detail.value);
        let chosenList = e.detail.value;
        let classList = vm.data.courseInfo.classGroupList;
        for(let i = 0;i<classList.length;i++){
            classList[i].checked = false;
            for(let j = 0;j<chosenList.length;j++){
                if(classList[i].id == chosenList[j]){
                    classList[i].checked = true;
                }
            }
        }
        //更新form中信息
        vm.data.form.classGroupIdList = e.detail.value;
        //更新courseInfo中信息，为了显示checked样式
        vm.data.courseInfo.classGroupList = classList;
        console.log(classList);
        vm.setData(vm.data);
    },
    goToStep2:function () {
        "use strict";
        let vm = this;
        if(vm.data.form.classGroupIdList.length == 0 || !vm.data.form.classGroupIdList.length){
            wx.showModal({
                title: '注意',
                content: '您尚未选择班级',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        vm.data.step = 2;
        vm.setData(vm.data);
    },
    goToStep1:function () {
        "use strict";
        let vm = this;
        vm.data.step = 1;
        vm.setData(vm.data);
    },
    setMessageTitle:function (e) {
        let vm = this;
        vm.data.form.title = e.detail.value;
        console.log(vm.data.form.title);
        vm.setData(vm.data);
    },
    setMessageContent:function (e) {
        let vm = this;
        vm.data.form.content = e.detail.value;
        console.log(vm.data.form.content);
        vm.setData(vm.data);
    },
    sendMessage:function (e) {

        let vm = this;
        console.log(vm.data.form);

        let classGroupNames = "";
        for(let i = 0; i < vm.data.courseInfo.classGroupList.length;i++){
            if(vm.data.courseInfo.classGroupList[i].checked){
                classGroupNames = classGroupNames + " " + vm.data.courseInfo.classGroupList[i].name;
            }
        }
        if(!vm.data.form.courseId){
            wx.showModal({
                title: '注意',
                content: '您未选择课程',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        if(!vm.data.form.title){
            wx.showModal({
                title: '注意',
                content: '您尚未输入通知标题',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        if(!vm.data.form.content){
            wx.showModal({
                title: '注意',
                content: '您尚未输入通知具体内容',
                showCancel: false,
                success: function (res) {

                }
            });
            return;
        }
        wx.showModal({
            title: '注意',
            content: '您即将发送给' + classGroupNames + '，是否继续？',
            showCancel: true,
            success: function (res) {
                wx.showToast({
                    title: '发送中',
                    icon: 'loading',
                });
                DataService('newCourseNotice',vm.data.form).then(function (response) {
                    "use strict";
                    wx.navigateTo({
                        url:'./SendMessageSuccess/SendMessageSuccess?targets=' + classGroupNames,
                        success:function () {
                            wx.hideToast();
                        }
                    })
                },function (error) {
                    wx.hideToast();
                    wx.showModal({
                        title: '发送失败',
                        content: '与服务器通讯失败',
                        showCancel: false,
                        success: function (res) {

                        }
                    });
                });

            }
        });
    }
});