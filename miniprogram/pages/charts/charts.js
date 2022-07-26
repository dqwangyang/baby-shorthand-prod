var db_util = require('../../utils/util.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showDayList: false,
		currentDate: new Date().getTime(),
		defaultDate: db_util.formatTime(new Date(), 'Y-M'),
		lineList: {},
		typeList: [],
		selectType: '喂奶'


	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {


		let user = wx.getStorageSync("userInfo");
		if (user == null || user._id == null || user._id == "") {
			wx.showModal({
				title: '提示',
				content: '您还没有登录',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						wx.redirectTo({
							url: '/pages/index/index',
						})
					}
				}
			})
			return;
		}

		let typeList = [{
			"_id": "6d127e375f292a48000024803d3ddaf5",
			"icon": "/images/icon_record_1.png",
			"name": "喂奶"
		}, {
			"_id": "7fbac6cf5f292dcf00002f3d3129d0a3",
			"icon": "/images/icon_record_2.png",
			"name": "换尿布"
		}, {
			"_id": "c8a291cf5f292a98000031234b01ab6b",
			"icon": "/images/icon_record_7.png",
			"name": "吃药"
		}, {
			"_id": "c8a291cf5f292a98000031430441ab6b",
			"icon": "/images/icon_record_4.png",
			"name": "辅食"
		}, {
			"_id": "c8a291cf5f292a98000031430b01ab6b",
			"icon": "/images/icon_record_3.png",
			"name": "睡觉"
		}, {
			"_id": "c8a291cf5f292a98000031430b03ab6b",
			"icon": "/images/icon_record_5.png",
			"name": "吸奶"
		}, {
			"_id": "c8a291cf5f292a980000315630b01ab6b",
			"icon": "/images/icon_record_6.png",
			"name": "洗澡"
		}, {
			"_id": "c8a291cf5f292e20000031df1485a535",
			"icon": "/images/height.png",
			"name": "身高"
		}, {
			"_id": "c8a291cf5f292e20000024df1485a535",
			"icon": "/images/tizhong.png",
			"name": "体重"
		}, {
			"_id": "c8a291cf5f292e20000034df1485a535",
			"icon": "other-pay",
			"name": "其它"
		}];
		this.setData({
			typeList: typeList
		});
		this.getShowData(this.data.defaultDate);

	},
	typeClick(ev) {
		var name = ev.currentTarget.dataset.name;
		this.setData({
			selectType: name
		});
		this.getShowData(this.data.defaultDate);


	},


	dayListClick: function() {
		this.setData({
			showDayList: true
		});
	},
	dayListConfirm: function(event) {
		var t = event.detail;
		var selectTime = db_util.getLocalTime(t);
		this.setData({
			showDayList: false,
			defaultDate: db_util.formatTime(new Date(selectTime.replace(/-/g, '/')), 'Y-M')
		});
		this.getShowData(this.data.defaultDate);
	},
	getShowData: function(selectTime) {
		let childId = wx.getStorageSync('child_id');
		let selectType = this.data.selectType;
		let me = this;
		wx.showLoading({
			title: '加载中',
		})
		if (selectType == '身高' || selectType == '体重') {
			db_util.getRecordsByTypeName( childId, selectType, function(res) {
				me.getShowRecords(res);

				wx.hideLoading({
					complete: (res) => {},
				})
			})
		} else {
			db_util.getRecordsBySearchTimeAndTypeName(selectTime, childId, selectType, function(res) {
				me.getShowRecords(res);

				wx.hideLoading({
					complete: (res) => {},
				})
			})
		}
	},
	onInstance({
		detail: instance
	}) {
		const dom = instance.getDom();

		// dom.saveAsImage().then((path) => {
		//   // 临时地址
		//   console.log(path);
		//   wx.saveImageToPhotosAlbum({
		//     filePath: path
		//   })
		// });
	},
	getShowRecords(records) {
		let timeList = [];
		let ls = {};
		let recordGroups = [];
		let allList = [];
		for (let i in records) {
			let item = records[i];
      let showTime = db_util.formatTime(new Date(item.seach_time), 'M-D');
      let selectType=this.data.selectType;
      if(selectType=='身高'||selectType=='体重'){
        showTime = db_util.formatTime(new Date(item.seach_time), 'Y-M-D');
      }
			let recordGroup = {};
			if (timeList.indexOf(showTime) < 0) {
				timeList.push(showTime);
				recordGroup = {};
				recordGroups = [];
				ls = {};
				ls.headTime = showTime;
				recordGroup.name = item.name;
				recordGroup.showTime = db_util.formatTime(new Date(item.seach_time), 'h:m');
				recordGroup.text1 = item.text1;
				recordGroup.text2 = item.text2;
				recordGroup.text3 = item.text3;
				recordGroup.text4 = item.text4;
				recordGroup.id = item._id;
				recordGroup.icon = item.icon;
				recordGroups.push(recordGroup);
				ls.recordGroups = recordGroups;
				allList.push(ls);
			} else {
				ls.headTime = showTime;
				recordGroup.name = item.name;
				recordGroup.showTime = db_util.formatTime(new Date(item.seach_time), 'h:m');
				recordGroup.text1 = item.text1;
				recordGroup.text2 = item.text2;
				recordGroup.text3 = item.text3;
				recordGroup.text4 = item.text4;
				recordGroup.id = item._id;

				recordGroup.icon = item.icon;
				recordGroups.push(recordGroup);
				ls.recordGroups = recordGroups;
			}

		}

		for (let i in allList) {
			let recordGroups = allList[i].recordGroups;

			let daySum = {};

			for (let j in recordGroups) {
				let item = recordGroups[j];
				if (item.name == '喂奶') {
					let weinai = {};
					weinai.showTime = item.showTime;
					weinai.quantity = item.text2;
					weinai.location = item.text1;
					weinai.icon = item.icon;
					daySum.quantity = (daySum.quantity || 0) + (weinai.quantity * 1);
					daySum.tt = "单位/ML";
				}
				if (item.name == '吸奶') {
					let xinai = {};
					xinai.showTime = item.showTime;
					xinai.quantity = item.text2;
					xinai.location = item.text1;
					xinai.icon = item.icon;
					daySum.quantity = (daySum.quantity || 0) + (xinai.quantity * 1);
					daySum.tt = "单位/ML";

				}
				if (item.name == '洗澡') {
					let xizao = {};
					xizao.showTime = item.showTime;
					xizao.memoto = item.text2;
					xizao.icon = item.icon;
					daySum.quantity = (daySum.quantity || 0) + 1;
					daySum.tt = "单位/次";

				}
				if (item.name == '身高') {
					let shengao = {};
					shengao.showTime = item.showTime;
					shengao.quantity = item.text1;
					daySum.quantity = (daySum.quantity || 0) + (shengao.quantity * 1);
					daySum.tt = "单位/CM";
				}
				if (item.name == '体重') {
					let tizhong = {};
					tizhong.showTime = item.showTime;
					tizhong.quantity = item.text1;
					daySum.quantity = (daySum.quantity || 0) + (tizhong.quantity * 1);
					daySum.tt = "单位/KG";
				}
				if (item.name == '其它') {
					let qita = {};
					qita.showTime = item.showTime;
					qita.memoto = item.text2;
					qita.icon = item.icon;
					daySum.quantity = (daySum.quantity || 0) + 1;
					daySum.tt = "单位/次";


				}
				if (item.name == '换尿布') {
					let niaobu = {};
					niaobu.showTime = item.showTime;
					niaobu.memoto = item.text2;
					niaobu.icon = item.icon;;
					daySum.quantity = (daySum.quantity || 0) + 1;
					daySum.tt = "单位/次";

				}
				if (item.name == '吃药') {
					let chiyao = {};
					chiyao.showTime = item.showTime;
					chiyao.text1 = item.text1;
					chiyao.icon = item.icon;
					daySum.quantity = (daySum.quantity || 0) + 1;
					daySum.tt = "单位/次";

				}
				if (item.name == '辅食') {
					let fushi = {};
					fushi.showTime = item.showTime;
					fushi.text1 = item.text1;
					fushi.quantity = item.text2;
					fushi.icon = item.icon;
					daySum.quantity = (daySum.quantity || 0) + (fushi.quantity * 1);
					daySum.tt = "单位/g";

				}
				if (item.name == '睡觉') {
					let shuijiao = {};
					shuijiao.showTime = item.showTime;
					shuijiao.icon = item.icon;
					shuijiao.text1 = Math.round((new Date(item.text2.replace(/-/g, '/')).getTime() - new Date(item.text1.replace(/-/g, '/')).getTime()) / (1000 * 60 * 60) * 100 / 100);
					daySum.quantity = (daySum.quantity || 0) + (shuijiao.text1 * 1);
					daySum.tt = "单位/小时";

				}
				allList[i].daySum = daySum;
			}

		}
		let series = [];
		let s = {};
		let xaxisData = [];
		s.data = [];
		for (let i in allList) {
			s.data.push(allList[i].daySum.quantity);
			xaxisData.push(allList[i].headTime);
		}
		s.type = "line";
		s.name = this.data.selectType;
		series.push(s);

		let chartsD = {};
		chartsD.series = series;
		chartsD.xAxis = {};
		chartsD.xAxis.data = xaxisData;
		chartsD.xAxis.type = "category"
		chartsD.yAxis = {};
		chartsD.yAxis.type = "value";

		chartsD.color = ['#FA8072'];

		let title = {
			text: this.data.selectType,
			show: true,
			subtext: allList.length > 0 ? allList[0].daySum.tt : ''
		};
		let tooltip = {
			trigger: "axis"
		};
		chartsD.tooltip = tooltip;
		chartsD.title = title;
		this.setData({
			lineList: chartsD
		});
		console.info(chartsD);
	},
	dayListCancel(event) {
		this.setData({
			showDayList: false
		});
	},

	onTabbarChange(event) {
		if (event.detail == 1) {
			wx.redirectTo({
				url: '/pages/search/search',
			})
		}
		if (event.detail == 3) {
			wx.redirectTo({
				url: '/pages/about/about',
			})
		}
		if (event.detail == 0) {
			wx.redirectTo({
				url: '/pages/index/index',
			})
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})