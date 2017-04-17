/**
 * Created by ares5 on 2017-01-22.
 */
let animation = wx.createAnimation({
    duration: 300,
    timingFunction: 'ease-in-out',
    delay: 100
});
animation.translateX(0).step();
module.exports = animation;