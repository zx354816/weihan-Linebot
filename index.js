﻿const linebot = require('linebot');
const express = require('express');
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");


const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

/*	測試Heroku平台的Node.js環境可以運作*/
app.get('/', function (req, res) {
	res.send('Hello World!');
});
app.post('/linewebhook', linebotParser);


const LOL_result = []; // 建立一個儲存結果的容器
const Beauty_result = []; // 建立一個儲存結果的容器


const PTTresult = [];
const PPT_webCrawler = function (_url, _posIndex, callb) {

	request({
		url: _url,
		method: "GET"
	}, function (error, response, body) {
		if (error || !body) {
			return;
		}
		const $ = cheerio.load(body); // 載入 body

		const title_class = $(".title"); // 爬外層的 (class=title)
		const nrec_class = $(".nrec");//推數的class


		PTTresult.length = 0;
		for (let i = 0; i < title_class.length - _posIndex; i++) {
			const title = title_class.eq(i).find('a').text();
			const url = title_class.eq(i).find('a').attr("href");
			const bbb = nrec_class.eq(i).text();
			if (url != undefined) {
				PTTresult.push(bbb + "推 " + title + "\nhttps://www.ptt.cc" + url + "\n");
			}
		}
		if (typeof callb === 'function') {
			callb();
		}
	});
};

const Dcardresult = [];
const Dcard_webCrawler = function (_url, _posStartIndex, _posEndIndex, callb) {

	request({
		url: _url,
		method: "GET"
	}, function (error, response, body) {
		if (error || !body) {
			return;
		}
		const $ = cheerio.load(body); // 載入 body

		const url_class = $(".PostList_entry_1rq5Lf"); // 爬外層的 (class=PostEntry_root_V6g0r)
		const Like_class = $(".PostEntry_reactions_3bbr43");//推數的class
		//const title_class = $(".PostEntry_content_g2afgv"); //標題的class，應該暫時用不到
		const content_cass = $(".PostEntry_excerpt_2eHlNn");//內文的class


		Dcardresult.length = 0;
		for (let i = _posStartIndex; i < _posEndIndex; i++) {
			//const title = title_class.eq(i).find('h3').text();
			const url = url_class.eq(i).find('a').attr("href");
			const bbb = Like_class.eq(i).text();
			const content = content_cass.eq(i).text();
			if (url != undefined) {
				Dcardresult.push(bbb + "推 https://www.dcard.tw" + url + "\n內文：" + content + "\n");
			}
		}
		if (typeof callb === 'function') {
			callb();
		}
	});
};







function limitRandomNumber(n, m) {
	var c = m - n + 1;
	return Math.floor(Math.random() * c + n);
}


var FoodList = ['巧味', '汕頭意麵', '歡歡', '來來軒', '影印店小籠包',
	'昌平', '龍門客棧', '麥當勞', '肯德基', '拿坡里', '新永豆', '黑永豆',
	'舊永豆', '胖老爹', '海之蚵', '佐賀', '飯鋪子', '紅豆', '福萱', '響樂',
	'浪人鐵板燒', '九龍城', '鴨香麵', '八方雲集', '老先覺', '饌喜堂', '聖明自助餐',
	'嘉鄰快餐', '吐司森林', '飯尾鰭', '海之柯', '再抽一次', '貢龜', '朝祥煮', 'Morning House',
	'7-11', '小管炒飯', '海膽炒蛋', '德記，可是倒了', '烏龍大王，可是倒了', '葉伴食堂'];

//var FoodList =[];



var pose = ['69式', '傳教式', '火車便當', '背入式', 'Oop式', '騎乘式', '活塞式', '口交', '毒龍鑽', '彎腰下狗式', '高鐵便當', '300號便當', '高速充電寶', '高速活塞', '認真活塞', '老漢推車', '蕩劍式', '直升機式'];


//第一個是key 第二個是值
var myDictionary = {
	'順口溜': '王代1\n2薩斯\n鄧佩3\n李4奇\n5負責\n6國有\n謝7佩\n8布魯克\n莊潤9\n10至華',
	'家鄉': '別問我家鄉',
	'沒聽過': '去試試看',
	'點名了嗎': '點了 可以回家了',
	'小小機器人': '功用非常多',
	'會幫爸爸': '捅屁眼',
	'會幫媽媽': '飛上天',
	'會幫哥哥': '打手槍',
	'還會跟我': '喝豆漿',
	'不要': '不要就是要',
	'要': '就是很想要',
	'你會做什麼': '我會......會吹口琴、玩玉簫、泡泡妞、看小書、占卜星相、觀人眉宇、風流倜儻、竊玉偷香。',
	'今天的幸運色': '綠色',
	'wow': 'AAA',
	'兇': '我看過很兇的，但沒看過這麼兇的',
	'哪一間鹹酥雞最好吃': '巧味',
	'對': '對什麼對',
	'嘻嘻': '嘻三小',
	'扭蛋': '沒有蛋',
	'你在說一次': '沒有就是沒有',
	'好': '好什麼好',
	'幹': '留點口德啦幹你娘機掰',
	'抽': '插',
	'Test': '改一下結構 從開始到結束有參數規定'

};
var allDictionary = [];
var msg;



bot.on('message', function (event) {
	if (event.message.type == 'sticker') {

	}


	else if (event.message.type == 'text') {
		//可以顯示貼圖，以後再新增
		if (event.message.text.match('zz') != null || event.message.text.match('ZZ') != null) {

			event.reply({
				type: 'sticker',
				packageId: '2',
				stickerId: '26'
			});
		}


		/*
            爬蟲顯示的地方
        */

		//PTT
		else if (event.message.text == 'lol') {
			PPT_webCrawler("https://www.ptt.cc/bbs/LoL/index.html", 4, function () {
				event.reply(PTTresult.join('\n').toString());
			});
		}
		else if (event.message.text == '表特') {
			PPT_webCrawler("https://www.ptt.cc/bbs/Beauty/index.html", 5, function () {
				event.reply(PTTresult.join('\n').toString());
			});
		}

		//Dcard
		else if (event.message.text == '靜宜熱門') {
			Dcard_webCrawler("https://www.dcard.tw/f/pu", 0, 5, function () {
				event.reply(Dcardresult.join('\n').toString());
			});
		}
		else if (event.message.text == '低卡熱門') {
			Dcard_webCrawler("https://www.dcard.tw/f", 0, 10, function () {
				event.reply(Dcardresult.join('\n').toString());
			});
		}
		else if (event.message.text == '西斯熱門') {
			Dcard_webCrawler("https://www.dcard.tw/f/sex", 2, 12, function () {
				event.reply(Dcardresult.join('\n').toString());
			});
		}


        /*
	     跟餐廳有關的操作：隨機、新增、移除、查看
	    */
		else if (event.message.text.match('吃啥') || event.message.text.match('吃什麼') || event.message.text.match('吃甚麼') != null) {

			var ListLength = FoodList.length;
			event.reply(FoodList[limitRandomNumber(0, ListLength - 1)]).then(function (data) {
				// success 
				console.log(msg);
			}).catch(function (error) {
				// error 
				console.log('error');
			});

		}
		else if (event.message.text.match('新增餐廳:') != null || event.message.text.match('新增餐廳：') != null) {

			var newString = event.message.text.substring(5);
			if (FoodList.indexOf(newString) == -1) {

				FoodList.push(newString);
				event.reply('已新增' + newString + '。').then(function (data) {
					// success 
					console.log(msg);
				}).catch(function (error) {
					// error 
					console.log('error');
				});


			}
			else {
				event.reply('裡面已經有這個了啦').then(function (data) {
					// success 
					console.log(msg);
				}).catch(function (error) {
					// error 
					console.log('error');
				});
			}
		}
		else if (event.message.text.match('移除餐廳:') != null || event.message.text.match('移除餐廳：') != null) {

			var newString = event.message.text.substring(5);
			if (FoodList.indexOf(newString) != -1) {

				var newnewString = FoodList.splice(FoodList.indexOf(newString), 1);

				event.reply('已移除' + newnewString + '。').then(function (data) {
					// success 
					console.log(msg);
				}).catch(function (error) {
					// error 
					console.log('error');
				});
			} else {
				event.reply('裡面沒有這間啦').then(function (data) {
					// success 
					console.log(msg);
				}).catch(function (error) {
					// error 
					console.log('error');
				});
			}
		}
		else if (event.message.text == '全部的餐廳' || event.message.text == '所有餐廳' || event.message.text == '全部餐廳' || event.message.text == '所有的餐廳') {

			var _all = FoodList.join('、').toString();

			event.reply(_all).then(function (data) {
				// success 
				console.log(msg);
			}).catch(function (error) {
				// error 
				console.log('error');
			});
		}

	    /*
           跟姿勢有關的操作：隨機、查看、新增、移除
        */
		else if (event.message.text.match('姿勢:') != null || event.message.text.match('姿勢：') != null) {
			var newString = event.message.text.substring(3);
			var ListLength = pose.length;
			event.reply(newString + pose[limitRandomNumber(0, ListLength - 1)]);

		}
		else if (event.message.text.match('教你pose:') != null || event.message.text.match('教你pose：') != null) {

			var newString = event.message.text.substring(7);
			if (pose.indexOf(newString) == -1) {

				pose.push(newString);
				event.reply('我學會' + newString + '了！');
			} else {
				event.reply('我已經會' + newString + '了啦');
			}
		}
		else if (event.message.text.match('忘記pose:') != null || event.message.text.match('忘記pose：') != null) {

			var newString = event.message.text.substring(7);
			if (pose.indexOf(newString) != -1) {

				var newnewString = pose.splice(pose.indexOf(newString), 1);

				event.reply('我忘記怎麼' + newnewString + '了......');
			} else {
				event.reply('= =我還不會' + newString + '辣');
			}
		}
		else if (event.message.text == '全部的姿勢' || event.message.text == '所有姿勢') {

			/*
			fs.readFile("pose.txt", "utf8", function (err, file) {
				var _all;
				_all = file.replace(new RegExp(",", "g"), "、");
				event.reply(_all);
			});
			*/


			var _all = pose.join('、').toString();
			event.reply(_all);

		}


		/*
		 教說話的地方
		*/
		else if (event.message.text.match('教你說話:') != null || event.message.text.match('教你說話：') != null || event.message.text.match('教你講話：') != null || event.message.text.match('教你講話:') != null) {
			var newString = event.message.text.substring(5);
			var index = newString.indexOf('；');
			var say = newString.substring(index + 1);
			var remember = newString.substring(0, index);

			if (index == -1) {
				event.reply('格式錯誤。').then(function (data) {
					// success 
					console.log(msg);
				}).catch(function (error) {
					// error 
					console.log('error');
				});

			} else {

				myDictionary[remember] = say;
				event.reply('學會了。').then(function (data) {
					// success 
					console.log(msg);
				}).catch(function (error) {
					// error 
					console.log('error');
				});
			}
		}


		/*
         看全部的值，現在有：餐廳、字典、姿勢
        */
		else if (event.message.text == 'Admin') {
			var ForMeToTestRestaurant = '\'' + FoodList.join('\',\'').toString() + '\''; //把全部的餐廳變成我要的格式
			event.reply(ForMeToTestRestaurant);
		}
		else if (event.message.text == 'Admin2') {
			allDictionary.length = 0;
			for (var key in myDictionary) {
				allDictionary.push('\'' + key + '\':\'' + myDictionary[key] + '\''); //把字典變成我要的格式
			}

			event.reply(allDictionary.toString());
		}
		else if (event.message.text == 'Admin3') {
			var allPose = '\'' + pose.join('\',\'').toString() + '\''; //把全部的姿勢變成我要的格式
			event.reply(allPose);
		}

		/*
		 教說話顯示的地方
		*/
		else {
			for (var key in myDictionary) {
				if (key == event.message.text) {

					event.reply(myDictionary[key] + '').then(function (data) {
						// success 
						console.log(msg);
					}).catch(function (error) {
						// error 
						console.log('error');
					});
				}
			}
		}
	}


});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});