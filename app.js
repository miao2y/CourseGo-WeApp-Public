//app.js
require('./libs/wx-pro');
const AV = require('./libs/av-weapp.js');
const DataService = require('./module/Tools.js');

AV.init({
    appId: 'g8uUbBT6Osbx1lFxAkmelE2f-gzGzoHsz',
    appKey: '73LX9xihYV3ajAEVpeVyNGi1',
});
App({
    onLaunch: function() {
        console.log(wx);
        wx.getSystemInfo({
            success: (res) => {
                wx.windowWidth = res.windowWidth;
                wx.windowHeight = res.windowHeight;
            }
        });
        //调用API从本地缓存中获取数据
        let logs = wx.getStorageSync( 'logs' ) || [];
        logs.unshift( Date.now() );
        wx.setStorageSync( 'logs', logs );
        let that = this;
    },
    getUserInfo: function( cb ) {
        var that = this;
        if( this.globalData.userInfo ) {
            typeof cb == "function" && cb( this.globalData.userInfo )
        } else {
            //调用登录接口
            wx.login( {
                success: function() {
                    wx.getUserInfo( {
                        success: function( res ) {
                            console.log(res);
                            that.globalData.userInfo = res.userInfo;
                            typeof cb == "function" && cb( that.globalData.userInfo )
                        }
                    })
                }
            });
        }
    },
    globalData: {
        userInfo: null,
        userToken: null,
        user:null,
        course:[]
    }
});
