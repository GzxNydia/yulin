//index.js
//获取应用实例
const app = getApp()
var vedioData = require('../../utils/vedioData.js')
Page({
  data: {
    navbar: ['视频', '音频', '图文'],
    currentTab: 0 ,
    list: [],
    listJz: [],
    userInfo: {},
    hasUserInfo: false,
    internet: '',//网络状态
    liuliang: 'false',//自动播放
    liuliangshow: 'false',//网络状态显示
    coverdisplay: 'none'//poster图片显示

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  onCommentTap:function(){
    console.log("comment") 
    wx.navigateTo({
      url: '/pages/comment/comment',
    })
  },
  onShareTap: function () {
    console.log("comment")
  },
  onLikeTap: function () {
    
  },
  onLoad: function() {

    //视频
    var _jzlist = [];
    var dic = vedioData.data;
    for (var i in dic) {
      _jzlist.push({
        name: i,
        time: dic[i].time,
        videoUrl: dic[i].videoUrl,
        price: dic[i].CakeType[0].CurrentPrice,
        des: dic[i].Means,
      })
    }
    this.setData({ "listJz": _jzlist });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function (res) {
    var that = this;
    wx.onNetworkStatusChange(function (res) {
      if (res.networkType == 'wifi') {
        console.log('自动播放')
        that.setData({
          coverdisplay: 'none',
          liuliang: 'true',
          liuliangshow: 'none',
        })
        console.log(that.data.liuliang)
        that.data.videoContext.pause()
        that.data.videoContext.play()
      } else {
        that.data.videoContext.pause()
        that.setData({
          liuliang: 'false',
          liuliangshow: 'block'
        })
      }
    })
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var res = res.networkType
        console.log(res);
        that.data.videoContext = wx.createVideoContext('myVideo');
        if (res == 'wifi') {
          console.log('自动播放')
          that.setData({
            coverdisplay: 'none',
            liuliang: 'true',
            liuliangshow: 'none',
          })
          console.log(that.data.liuliang)
          that.data.videoContext.pause()
          that.data.videoContext.play()
        } else {
          that.data.videoContext.pause()
          that.setData({
            liuliang: 'false',
            liuliangshow: 'block'
          })
        }
      }
    })
  }
  
})