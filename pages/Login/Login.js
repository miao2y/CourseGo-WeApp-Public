/**
 * Created by ares5 on 2017/2/13.
 */
var app = getApp();
const DataService = require('../../module/Tools.js');
Page({
    data: {

    },
    onLoad: function (option) {

    },
    onShow:function () {
        let vm = this;
    },
    goToRegister:function () {
        wx.navigateTo({
            url:'../BindTelephone/BindTelephone',
            success:function () {
                "use strict";
            }
        })
    },
    goToBindAccount:function () {
        wx.navigateTo({
            url:'../BindAccount/BindAccount',
            success:function () {
                "use strict";
            }
        })
    }
});