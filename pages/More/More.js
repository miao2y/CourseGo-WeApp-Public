let app = getApp();
const AV = require('../../libs/av-weapp.js');
Page({
    data: {

    },
    onLoad: function () {
        const user = AV.User.current();
        //检查用户资料填写状态
        // if(user.get('mobilePhoneVerified')){
        //     DataService('checkHasBasicInformation',{}).then(function (result) {
        //         if(!result.hasBasicInformation){
        //             wx.redirectTo({
        //                 url:'fillData'
        //             });
        //         }
        //     },function (error) {
        //
        //     });
        // }else{
        //     wx.redirectTo({
        //         url:'index',
        //         fail:function (error) {
        //             console.log(error);
        //         },
        //         success:function (result) {
        //             console.log(result);
        //         }
        //     });
        // }
        let vm = this;
        app.getUserInfo(function (userInfo) {
            vm.data.wxUser = userInfo;
            console.log(userInfo);
        });
        console.log(user);
    }
});