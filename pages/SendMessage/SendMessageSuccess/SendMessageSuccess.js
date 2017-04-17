var app = getApp();
Page({
    data: {
        messageList : []
    },
    onLoad: function (option) {
        "use strict";
        let vm = this;
        console.log(option);
        vm.data.classGroupNames = option.targets;
        vm.setData(vm.data);
        let pageArray = getCurrentPages();
        let length = pageArray.length;
        console.log(pageArray[length-1]);
        switch (pageArray[length-3].__route__){
            case 'pages/dashboard/dashboard':{
                vm.data.from = '首页';
                break;
            }
            case 'pages/CourseDetail/CourseDetail':{
                vm.data.from = '课程详情';
                break;
            }
            case 'pages/MessageList/MessageList':{
                vm.data.from = '历史消息';
                break;
            }
        }
        vm.setData(vm.data);
    },
    onShow:function () {
        let vm = this;
    },
    goBack:function () {
        wx.navigateBack({
            delta: 2
        });
    },
    continueSendMessage(){
        "use strict";
        wx.navigateBack({
            delta: 1
        });
    }
});