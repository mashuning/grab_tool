var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var xlsx = require('node-xlsx');

//初始url
var url = ""; 

// http://gaokao.chsi.com.cn/zsgs/zzxblqzgmd--method-listStu,ssdm-11,yxdm-10001,year-2017,zslx=1.dhtml
// http://gaokao.chsi.com.cn/zsgs/zzlqmd--method-listStu,ssdm-11,yxdm-10001,year-2017,zslx=1.dhtml

//存学校的数字，循环取
var num=[11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,42,43,44,45,50,51,52,53,54,61,62,63,64,65];
var school=[10001,10002,10003,10004,10005,10006,10007,10008,10010,10013,10022,10026,10027,10032,10033,10034,10036,10053,10054,10055,10056,10141,10145,10151,10183,10200,10212,10213,10217,10246,10247,10248,10251,10255,10269,10271,10272,10280,10284,10285,10286,10287,10288,10290,10294,10295,10307,10316,10319,10335,10358,10359,10384,10386,10422,10423,10425,10459,10486,10487,10491,10497,10504,10511,10520,10532,10533,10540,10558,10561,10593,10610,10611,10613,10651,10652,10657,10673,10697,10698,10699,10701,10710,10712,10718,10730,11414];          
for(var j=0;j<num.length;j++){
    for(var x=0;x<school.length;x++){
        url='http://gaokao.chsi.com.cn/zsgs/zzlqmd--method-listStu,ssdm-'+num[j]+',yxdm-'+school[x]+',year-2017,zslx=1.dhtml';
       // console.log(url);
        startRequest(url);
    }
}

function startRequest(x) {
    //采用http模块向服务器发起一次get请求      
   http.get(x, function (res) {     
       var html = '';        //用来存储请求网页的整个html内容
       var detail = [];        
       res.setEncoding('utf-8'); //防止中文乱码
    //监听data事件，每次取一块数据
       res.on('data', function (chunk) {   
           html += chunk;
       });
       
    //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
       res.on('end', function () {
           var obj = []                // 行
           var myxls = []              //xls文件 
           var table = {}              // 文件里面的表
           var $ = cheerio.load(html); //采用cheerio模块解析html
           //console.log(html);
           var len = $('#YKTabCon2_10 tbody tr').length;
           var tdlen = $('#YKTabCon2_10 tbody tr:nth-child(1) td').length;
           console.log('trlen:'+ len, 'tdlen:' + tdlen)
           for(let i = 1; i<=len; i++) {
               var data = []            // 列
               for(let j = 1; j<=tdlen; j++) {
                   detail = $('#YKTabCon2_10 tbody tr:nth-child('+i+') td:nth-child('+j+')').text().trim();
                   data.push(detail)
               }
               obj.push(data)
           }
           table.data=obj
           table.name='Sheet'
           myxls.push(table)
              
           savedContent($,myxls);
       });

   }).on('error', function (err) {
       console.log(err);
   });

}

//在本地存储所爬取的学生内容
function savedContent($, obj) {
	var name = $('.center').text().trim();
    console.log(name);
    //转成buffer
    var file = xlsx.build(obj);
    var diqu=$('#YKTabCon2_10 tbody tr td:nth-child(3)').text().substring(4, 6);
    console.log(diqu);

	fs.appendFile('./data/' + name +'('+ diqu +')'+ '.xlsx', file, 'binary', function (err) {
			if (err) {
				console.log(err);
            }
            else{
                console.log("写成功了");
            }
	});
        
}
     