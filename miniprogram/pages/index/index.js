//index.js
const app = getApp()
var db_util = require('../../utils/util.js');
import Notify from '@vant/weapp/notify/notify';
import Dialog from '@vant/weapp/dialog/dialog';

Page({
	data: {
		userInfo: {},
		recordList: [],
		canIUseGetUserProfile: false,
		babyInfo: {
			sex: 1,
			name: '宝宝',
			brithday: db_util.formatTime(new Date(), 'Y-M-D'),
			age: '0天'

		},

		typeList: [],
		showDayList: false,
		selectedType: '',
		currentDate: new Date().getTime(),
		weinaiShow: false,
		weinaiRecord: {},
		shuijiaoShow: false,
		shuijiaoRecord: {},
		xinaiShow: false,
		xinaiRecord: {},
		fushiShow: false,
		fushiRecord: {},
		xizaoShow: false,
		xizaoRecord: {},
		shengaoShow: false,
		shengaoRecord: {},
		tizhongShow: false,
		tizhongRecord: {},
		chiyaoShow: false,
		chiyaoRecord: {},
		niaobuShow: false,
		niaobuRecord: {},
		qitaShow: false,
		qitaRecord: {},
		isLogin: false,
		baobaoShow: false,
		showSex: false,
		sexList: ['男', '女'],
		shareActions: [{
				name: '分享给家人',
				color: '#07c160',
				openType: 'share'
			}, {
				name: '取消',
				color: '#000000'
			},

		],
		shareShow: false,
		noticeList: [],
		notice: '喂奶后要给宝宝拍嗝，将宝宝喝奶时一同吸入胃中的空气排出，才可避免溢奶或吐奶。'

	},
	// /**
	//  * 用户点击右上角分享
	//  */
	// onShareAppMessage: function () {
	//   return {
	//     title: this.data.userInfo.nick_name + '邀您一起记录' + this.data.babyInfo.name +'的成长',
	//     path: '/pages/index/index?child_id=' + this.data.babyInfo._id
	//   }
	// },
	/**
	 * 用户点击右上角分享
	 */
	onShareTimeline: function() {
		return {
			title: this.data.userInfo.nick_name + '邀您一起记录' + this.data.babyInfo.name + '的成长',
			query: {
				child_id: this.data.babyInfo._id
			}
		}
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		let user = wx.getStorageSync("userInfo");
		if (user != null && user._id != null && user._id != "") {

			this.setData({
				userInfo: user
			});
		}
	},
	shareClose() {
		this.setData({
			shareShow: false
		});
	},

	/**
	 * 分享给家人
	 */
	gotoInvit: function() {
		if (!this.data.isLogin) {
			Notify({
				type: 'danger',
				background: "#FF9DCA",
				message: '您还没有登录哦'
			});
			return;
		}
		this.setData({
			shareShow: true
		});
	},
	/**
	 * 宝宝性别改变
	 */
	sexChange(event) {
		const {
			picker, value, index
		} = event.detail;
		let child = this.data.babyInfo;
		child.sex = value;
		this.setData({
			babyInfo: child
		})

	},
	showSexList: function() {
		this.setData({
			showSex: true
		});
	},
	showSexChannel: function() {
		this.setData({
			showSex: false

		});
	},

	showSexConfirm: function(event) {

		const {
			picker, value, index
		} = event.detail;
		let child = this.data.babyInfo;
		child.sex = value;
		this.setData({
			showSex: false,
			babyInfo: child

		});
	},
	updateUserInfo() {

		wx.navigateTo({
			url: '/pages/user/user',
		})
	},
	typeClick(ev) {
		let name = ev.currentTarget.dataset.name;
		let record = ev.currentTarget.dataset.item;
		let isUpdate = ev.currentTarget.dataset.update || 0;

		if (name == '喂奶') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = '';
				record.text2 = '10';
				record.text3 = db_util.getLocalTime(new Date().getTime());
				record.text4 = "";
			}
			this.setData({
				weinaiShow: true,
				weinaiRecord: record

			})
		}
		if (name == '睡觉') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = db_util.getLocalTime(new Date().getTime());
				record.text2 = db_util.getLocalTime(new Date().getTime());
				record.text3 = "";
				record.text4 = "";
			}
			this.setData({
				shuijiaoShow: true,
				shuijiaoRecord: record

			})
		}
		if (name == '吸奶') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = '';
				record.text2 = '10';
				record.text3 = db_util.getLocalTime(new Date().getTime());
				record.text4 = "";
			}
			this.setData({
				xinaiShow: true,
				xinaiRecord: record

			})
		}
		if (name == '辅食') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = '';
				record.text2 = '2';
				record.text4 = "";
				record.text3 = db_util.getLocalTime(new Date().getTime());
			}
			this.setData({
				fushiShow: true,
				fushiRecord: record

			})
		}

		if (name == '洗澡') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = db_util.getLocalTime(new Date().getTime());
				record.text2 = "";
				record.text3 = "";
				record.text4 = "";
			}
			this.setData({
				xizaoShow: true,
				xizaoRecord: record

			})
		}
		if (name == '身高') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = 0;
				record.text2 = db_util.getLocalTime(new Date().getTime());
				record.text3 = "";

			}
			this.setData({
				shengaoShow: true,
				shengaoRecord: record

			})
		}
		if (name == '体重') {
			if (isUpdate == 0) {
				record = {};
				record.text1 = 0;
				record.text2 = db_util.getLocalTime(new Date().getTime());
				record.text3 = "";

			}
			this.setData({
				tizhongShow: true,
				tizhongRecord: record

			})
		}
		if (name == '吃药') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = "";
				record.text2 = db_util.getLocalTime(new Date().getTime());
				record.text3 = "";
				record.text4 = "";
			}
			this.setData({
				chiyaoShow: true,
				chiyaoRecord: record
			})
		}
		if (name == '换尿布') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = db_util.getLocalTime(new Date().getTime());
				record.text2 = '';
				record.text3 = "";
				record.text4 = "";
			}
			this.setData({
				niaobuShow: true,
				niaobuRecord: record

			})
		}
		if (name == '其它') {
			if (isUpdate == 0) {
				record = {};

				record.text1 = db_util.getLocalTime(new Date().getTime());
				record.text2 = "";
				record.text3 = "";
				record.text4 = "";
			}
			this.setData({
				qitaShow: true,
				qitaRecord: record
			})
		}

	},
	submitRecord(e) {

		if (!this.data.isLogin) {

			Notify({
				type: 'danger',
				background: "#FF9DCA",
				message: '您还没有登录哦'
			});
			return;
		}
		let name = e.currentTarget.dataset.name;
		let record = {};
		if (name == '喂奶') {
			record = this.data.weinaiRecord;
			record.seach_time = new Date(record.text3.replace(/-/g, '/')).getTime();
			console.log(record.seach_time);
		}
		if (name == '换尿布') {
			record = this.data.niaobuRecord;
			record.seach_time = new Date(record.text1.replace(/-/g, '/')).getTime();
		}
		if (name == '吃药') {
			record = this.data.chiyaoRecord;
			record.seach_time = new Date(record.text2.replace(/-/g, '/')).getTime();
		}
		if (name == '辅食') {
			record = this.data.fushiRecord;
			record.seach_time = new Date(record.text3.replace(/-/g, '/')).getTime();
		}
		if (name == '睡觉') {
			record = this.data.shuijiaoRecord;
			record.seach_time = new Date(record.text1.replace(/-/g, '/')).getTime();
		}
		if (name == '吸奶') {
			record = this.data.xinaiRecord;
			record.seach_time = new Date(record.text3.replace(/-/g, '/')).getTime();
		}
		if (name == '身高') {
			record = this.data.shengaoRecord;
			record.seach_time = new Date(record.text2.replace(/-/g, '/')).getTime();
		}
		if (name == '体重') {
			record = this.data.tizhongRecord;
			record.seach_time = new Date(record.text2.replace(/-/g, '/')).getTime();
		}
		if (name == '洗澡') {
			record = this.data.xizaoRecord;
			record.seach_time = new Date(record.text1.replace(/-/g, '/')).getTime();
		}
		if (name == '其它') {
			record = this.data.qitaRecord;
			record.seach_time = new Date(record.text1.replace(/-/g, '/')).getTime();

		}
		var me = this;
		this.overlayClose();

		if (!record._id) {
			let userinfo = this.data.userInfo;
			let child_id = wx.getStorageSync('child_id');
			record.name = name;
			record.user_id = userinfo._id;
			record.child_id = child_id;
			record.nick_name = userinfo.nick_name;
			record.avatar_url = userinfo.avatar_url;
			record.create_time = db_util.getLocalTime(new Date().getTime());
			record.icon = this.getTypeByName(name).icon;
			//关闭窗口
			db_util.add('mm_records', record, function(_id) {
				//获取今日列表     
				me.getTodayRecords();

			});
		} else {
			db_util.updateRecords(record, function() {
				me.getTodayRecords();

			});
		}

	},
	gotoMyinfo() {
		this.setData({
			baobaoShow: true
		});
	},
	/**
	 * 获取今日记录数据
	 */
	getTodayRecords() {
		var me = this;
		if (!this.data.isLogin) {
			return;
		}
		let user = wx.getStorageSync("userInfo");
		let child_id = wx.getStorageSync('child_id');
		wx.showLoading({
			title: '加载中',
		})
		if (child_id == '' || child_id == 'null' || child_id == null) {
			db_util.getChildIdByUserId(user._id, function(_id) {
				wx.setStorageSync('child_id', _id);
				db_util.getChild(_id, function(childs) {
					let child = childs[0];
					if (child.brithday != '') {
						child.age = db_util.getAge(child.brithday);
					} else {
						child.age = '0天';
					}
					wx.setStorageSync('child', child);
					me.setData({
						babyInfo: child
					});
				});
				db_util.getRecordsToday(user._id, _id, function(records) {
					for (let i in records) {
						records[i].showTime = db_util.formatTime(new Date(records[i].seach_time), 'h:m');
					}
					me.setData({
						recordList: records
					});
					me.getNoticeList(records);
					wx.hideLoading();

				});
			});
		} else {
			db_util.getRecordsToday(user._id, child_id, function(records) {
				for (let i in records) {

					records[i].showTime = db_util.formatTime(new Date(records[i].seach_time), 'h:m');
				}
				me.setData({
					recordList: records
				});
				me.getNoticeList(records);

				wx.hideLoading();

			});
			db_util.getChild(child_id, function(childs) {
				let child = childs[0];
				child.age = db_util.getAge(child.brithday);
				wx.setStorageSync('child', child);
				me.setData({
					babyInfo: child
				});
			});
		}
	},
	getNoticeList(recordList) {
		let notices = [];
		let str = '';
		for (let i in recordList) {
			let item = recordList[i];
			str += item.showTime + '--' + item.name + "--";
			if (item.name == '喂奶' || item.name == '吸奶') {
				str += item.text1 + "--" + item.text2 + "ml";
			}
			if (item.name == '身高') {
				str += item.text1 + item.text3 + "cm";
			}
			if (item.name == '体重') {
				str += item.text1 + item.text3 + "kg";
			}
			if (item.name == '吃药') {
				str += item.text1 + "             ";
			}
			if (item.name == '辅食') {
				str += item.text1 + "--" + item.text2 + 'g ';
			}
			if (item.name == '其它' || item.name == '换尿布' || item.name == '洗澡') {
				str += item.text2;
			}
			str += ">>>>>>";
		}
		if (str != '') {
			this.setData({
				notice: str
			});
		}

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
		if (event.detail == 2) {
			wx.redirectTo({
				url: '/pages/charts/charts',
			})
		}
	},
	text1Input(e) {
		let name = e.currentTarget.dataset.name;
		let record = {};
		if (name == '喂奶') {
			record = this.data.weinaiRecord;
			record.text1 = e.detail;
			record.icon = "";
			this.setData({
				weinaiRecord: record
			});
		}
		if (name == '吃药') {
			record = this.data.chiyaoRecord;
			record.text1 = e.detail;
			this.setData({
				chiyaoRecord: record
			});
		}
		if (name == '辅食') {
			record = this.data.fushiRecord;
			record.text1 = e.detail;
			this.setData({
				fushiRecord: record
			});
		}
		if (name == '吸奶') {
			record = this.data.xinaiRecord;
			record.text1 = e.detail;
			this.setData({
				xinaiRecord: record
			});
		}
		if (name == '身高') {
			record = this.data.shengaoRecord;
			record.text1 = e.detail;
			this.setData({
				shengaoRecord: record
			});
		}
		if (name == '体重') {
			record = this.data.tizhongRecord;
			record.text1 = e.detail;
			this.setData({
				tizhongRecord: record
			});
		}

	},
	text2Input(e) {
		let name = e.currentTarget.dataset.name;
		let record = {};
		if (name == '喂奶') {
			record = this.data.weinaiRecord;
			record.text2 = e.detail;
			this.setData({
				weinaiRecord: record
			});
		}
		if (name == '换尿布') {
			record = this.data.niaobuRecord;
			record.text2 = e.detail;
			this.setData({
				niaobuRecord: record
			});
		}
		if (name == '辅食') {
			record = this.data.fushiRecord;
			record.text2 = e.detail;
			this.setData({
				fushiRecord: record
			});
		}
		if (name == '吸奶') {
			record = this.data.xinaiRecord;
			record.text2 = e.detail;
			this.setData({
				xinaiRecord: record
			});
		}
		if (name == '洗澡') {
			record = this.data.xizaoRecord;
			record.text2 = e.detail;
			this.setData({
				xizaoRecord: record
			});
		}
		if (name == '其它') {
			record = this.data.qitaRecord;
			record.text2 = e.detail;
			this.setData({
				qitaRecord: record
			});
		}

	},
	text3Input(e) {
		let name = e.currentTarget.dataset.name;
		let record = {};
		if (name == '吃药') {
			record = this.data.chiyaoRecord;
			record.text3 = e.detail;
			this.setData({
				chiyaoRecord: record
			});
		}
		if (name == '睡觉') {
			record = this.data.shuijiaoRecord;
			record.text3 = e.detail;
			this.setData({
				shuijiaoRecord: record
			});
		}

		if (name == '身高') {
			record = this.data.shengaoRecord;
			record.text3 = e.detail;
			this.setData({
				shengaoRecord: record
			});
		}
		if (name == '体重') {
			record = this.data.tizhongRecord;
			record.text3 = e.detail;
			this.setData({
				tizhongRecord: record
			});
		}


	},
	text4Input(e) {
		let name = e.currentTarget.dataset.name;
		let record = {};
		if (name == '喂奶') {
			record = this.data.weinaiRecord;
			record.text4 = e.detail;
			this.setData({
				weinaiRecord: record
			});
		}
		if (name == '辅食') {
			record = this.data.fushiRecord;
			record.text4 = e.detail;
			this.setData({
				fushiRecord: record
			});
		}
		if (name == '吸奶') {
			record = this.data.xinaiRecord;
			record.text4 = e.detail;
			this.setData({
				xinaiRecord: record
			});
		}
	},
	overlayClose() {
		this.setData({
			weinaiShow: false,
			shuijiaoShow: false,
			xinaiShow: false,
			fushiShow: false,
			xizaoShow: false,
			chiyaoShow: false,
			niaobuShow: false,
			qitaShow: false,
			baobaoShow: false,
			shengaoShow: false,
			tizhongShow: false
		});
	},
	deleteRecord: function(ev) {
		let id = ev.currentTarget.dataset.id;
		console.info(id);
		let that = this;
		wx.showModal({
			title: '',
			content: '删除后无法恢复，是否继续？',
			success(res) {
				if (res.confirm) {

					db_util.deleteRecord(id, function() {
						that.getTodayRecords();

					});
				} else if (res.cancel) {

				}
			}
		})

	},
	babyInfoSubmit: function() {
		let child = this.data.babyInfo;
		var me = this;
		if (!this.data.isLogin) {

			Notify({
				type: 'danger',
				background: "#FF9DCA",
				message: '您还没有登录哦'
			});
			this.setData({
				baobaoShow: false
			});
			return;
		}
		child.age = db_util.getAge(child.brithday);
		db_util.updateChild(child, function() {
			wx.setStorageSync('child', child);
			me.setData({
				babyInfo: child,
				baobaoShow: false
			});
		});
	},
	bbNameInput: function(e) {
		let child = this.data.babyInfo;
		child.name = e.detail;
		this.setData({
			babyInfo: child
		});
	},
	showDayList(ev) {
		var name = ev.currentTarget.dataset.name;
		this.setData({
			showDayList: true,
			selectedType: name
		});

	},
	dayListConfirm(event) {
		var t = event.detail;
		var selectTime = db_util.getLocalTime(t);
		let name = this.data.selectedType;
		if (name == '喂奶') {
			let record = this.data.weinaiRecord;
			record.text3 = selectTime;
			this.setData({
				weinaiRecord: record
			});
		}
		if (name == '换尿布') {
			let record = this.data.niaobuRecord;
			record.text1 = selectTime;
			this.setData({
				niaobuRecord: record
			});
		}
		if (name == '吃药') {
			let record = this.data.chiyaoRecord;
			record.text2 = selectTime;
			this.setData({
				chiyaoRecord: record
			});
		}
		if (name == '辅食') {
			let record = this.data.fushiRecord;
			record.text3 = selectTime;
			this.setData({
				fushiRecord: record
			});
		}
		if (name == '睡觉1') {
			let record = this.data.shuijiaoRecord;
			record.text1 = selectTime;
			this.setData({
				shuijiaoRecord: record
			});
		}
		if (name == '睡觉2') {
			let record = this.data.shuijiaoRecord;
			record.text2 = selectTime;
			this.setData({
				shuijiaoRecord: record
			});
		}
		if (name == '吸奶') {
			let record = this.data.xinaiRecord;
			record.text3 = selectTime;
			this.setData({
				xinaiRecord: record
			});
		}
		if (name == '洗澡') {
			let record = this.data.xizaoRecord;
			record.text1 = selectTime;
			this.setData({
				xizaoRecord: record
			});
		}
		if (name == '其它') {
			let record = this.data.qitaRecord;
			record.text1 = selectTime;
			this.setData({
				qitaRecord: record
			});
		}
		if (name == '生日') {
			let child = this.data.babyInfo;
			child.brithday = db_util.formatTime(new Date(selectTime.replace(/-/g, '/')), 'Y-M-D');
			this.setData({
				babyInfo: child
			});
		}
		if (name == '身高') {
			let record = this.data.shengaoRecord;
			record.text2 = selectTime;
			this.setData({
				shengaoRecord: record
			});
		}
		if (name == '体重') {
			let record = this.data.tizhongRecord;
			record.text2 = selectTime;
			this.setData({
				tizhongRecord: record
			});
		}

		this.setData({
			showDayList: false
		});
	},
	onShareAppMessage: function() {
		return {
			title: '宝宝速记',
			desc: '快来记录宝宝的日常吧~',
			path: '/pages/index/index' // 路径，传递参数到指定页面。
		}
	},
	dayListCancel() {
		this.setData({
			showDayList: false
		});
	},
	onLoad: function(e) {
		if (!wx.cloud) {
			return
		}
		let child_id = e.child_id;
		//let child_id="6d127e375f30acd300034dca32212ff5";
		if (child_id) {
			wx.setStorageSync('share_child_id', child_id);
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
		let user = wx.getStorageSync("userInfo");
		var that = this;
		if (user != null && user._id != null && user._id != "") {
			wx.showLoading({
				title: '加载中',
			})
			db_util.getUserById(user._id, function(users) {
				if (users.length <= 0) {
					wx.clearStorageSync();
					wx.hideLoading({
						complete: (res) => {},
					})
					let userInfo = {};
					userInfo.avatar_url = "../../images/unlogin.png";
					this.setData({
						userInfo: userInfo,
						isLogin: false
					});
				}
				let user = users[0];
				that.setData({
					userInfo: user,
					isLogin: true
				})
				that.getTodayRecords();

				wx.hideLoading();
			});

		} else {
			let userInfo = {};
			userInfo.avatar_url = "../../images/unlogin.png";
			this.setData({
				userInfo: userInfo,
				isLogin: false
			});
			if (wx.getUserProfile) {
				this.setData({
					canIUseGetUserProfile: true
				})
			}
		}
		//获取今日数据

	},
	getTypeByName(name) {
		let typeList = this.data.typeList;
		for (let i in typeList) {
			if (name == typeList[i].name) {
				return typeList[i];
			}
		}
	},
	onGetOpenid: function(e) {


		if (this.data.canIUseGetUserProfile) {
			wx.getUserProfile({
				desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
				success: (res) => {


					this.getUserInfo(res.userInfo);

				}
			});
		} else {
			this.getUserInfo(e.detail.userInfo);
		}

	},
	// getOpenIdByCode(openCode) {
	// 	let params = {
	// 		code: openCode
	// 	};
	// 	http.getRequest(app.URL + '/baobao/byCode', params,
	// 		function(res) {
	// 			let openId = res.result.open_id;
	// 		}, function(res) {
	// 			console.log(res);
	// 		});
	// },
	getUserInfo: function(user) {
		let userInfo = this.data.userInfo;
		userInfo.avatar_url = user.avatarUrl;
		userInfo.nick_name = user.nickName;
		userInfo.province = user.province;
		userInfo.gender = user.gender;
		userInfo.create_time = db_util.getLocalTime(new Date().getTime());
		var me = this;
		wx.showLoading({
				title: '加载中',
			})
			// 调用云函数
		wx.cloud.callFunction({
			name: 'login',
			data: {},
			success: res => {
				userInfo.open_id = res.result.openid;
				wx.hideLoading();

				//先查询用户是否存在
				db_util.getUserByOpenId(userInfo.open_id, function(users) {
					if (users.length > 0) {
						userInfo._id = users[0]._id;
						wx.setStorageSync('userInfo', users[0]);
						me.setData({
							userInfo: users[0],
							isLogin: true
						});
						let share_child_id = wx.getStorageSync('share_child_id');
						//查询用户的宝宝ID
						db_util.getChildIdByUserId(userInfo._id, function(_id) {
							db_util.getChild(share_child_id, function(childs) {
							
								if(share_child_id&&share_child_id!=_id){
												//弹出提示是否要绑定新的宝宝
												Dialog.confirm({
													title: '新宝宝提示',
													message: '是否要绑定【'+childs[0].name+"】为您的宝宝？\n绑定后，以前的宝宝数据会被清空~",
												}).then(() => {
														// on confirm
														//更新宝宝为最新的宝宝
														wx.showLoading({
															title: '更新中...',
														})
														db_util.getUserChildByUserId(userInfo._id ,function (res){

															db_util.updateUserChild(res._id,share_child_id ,function (res){
																wx.hideLoading({
																	success: (res) => {},
																})
																me.getTodayRecords();

															});
														});										
													}).catch(() => {
														// on cancel
														me.getTodayRecords();

													})
								}else{
									me.getTodayRecords();

								}
								
							
							});
						
						
						});
				

					} else {
						//新用户，插入数据库，创建宝宝对象
						db_util.add('mm_user', userInfo, function(_id) {
							userInfo._id = _id;
							wx.setStorageSync('userInfo', userInfo);
							me.setData({
								userInfo: userInfo,
								isLogin: true
							});
							//插入成功后创建一个宝宝对象
							let share_child_id = wx.getStorageSync('share_child_id');
							if (share_child_id) {
								//如果是点击的分享过来的
								wx.setStorageSync('child_id', share_child_id);
								let baby_user = {};
								baby_user.child_id = share_child_id;
								baby_user.user_id = userInfo._id;
								db_util.add('mm_user_childs', baby_user, function(_id) {
									me.getTodayRecords();
								});
							} else {
								let baby = {};
								baby.name = '宝宝';
								baby.sex = '女';
								baby.brithday = db_util.getLocalTime(new Date().getTime());
								baby.create_time = baby.brithday;
								db_util.add('mm_childs', baby, function(_id) {
									//创建宝宝和用户的关系
									let baby_id = _id;
									wx.setStorageSync('child_id', baby_id);
									let baby_user = {};
									baby_user.child_id = baby_id;
									baby_user.user_id = userInfo._id;
									db_util.add('mm_user_childs', baby_user, function(_id) {
										me.getTodayRecords();
									});

								});
							}
						});

					}

				})

			},
			fail: err => {
				console.error('[云函数] [login] 调用失败', err)

			}
		})
	}




})