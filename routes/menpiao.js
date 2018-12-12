'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var fs = require('fs');
var multiparty = require('multiparty');



var Todo = AV.Object.extend('Ticketsrecord');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
    var query = new AV.Query(Todo);
    // query.descending('updatedAt');
    query.find().then(function(results) {

        // console.log(results,'err');


        res.render('menpiao.html', {
                title: '门票兑换列表',
                lists: results,
                user: req.currentUser,



            }

            // console.log(results.name,'666')

        );
    }, function(err) {
              res.redirect('/users/login');

        if (err.code === 101) {
            // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
            // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
            res.render('menpiao.html', {
                title: '门票兑换列表',
                lists: []
            });
        } else {
            next(err);
        }
    }).catch(next);
});

router.post('/', function(req, res, next) {

    var content = req.body.butt;

    console.log(content, '76')

    var query = new AV.Query(Todo);
    // var status = req.query.status;

    // query.descending('createdAt');
    query.find().then(function(results) {

        // console.log(results.attributes,'err');

        for (var i = 0; i < results.length; i++) {
            // #{<%= lists[item].get("objectId") %>
            // console.log(item[results].get('objectId'),'123')
            // console.log(results[i].get("objectId"),'123');
            // console.log(i,'i');
            // var content = req.body.butt;

            if (content == i) {

                console.log(i, '1')
                console.log(content, '2')
                console.log(results[i].get('objectId'), '333');

                var ccc = AV.Object.createWithoutData('Ticketsrecord', results[i].get('objectId'));

                ccc.set('yanzheng', true);
                ccc.save();
                res.redirect('/menpiao');
            }

            console.log('yes')
        };

        var shanchu = req.body.shanchu;

        var todo = AV.Object.createWithoutData('Ticketsrecord', shanchu);
        todo.destroy().then(function(success) {
            // res.redirect('/duihuan?status=' + status);
            res.redirect('/menpiao.html');

        }, function(err) {
            res.redirect('/menpiao.html');
        }).catch(next);

    })






});




// 新增 Todo 项目
// var fs = require('fs');

// router.post('/', function(req, res, next) {

//     var form = new multiparty.Form();
//   form.parse(req, function(err, fields, files) {


// var todo = new Todo();



//     var iconFile = files.iconImage[0];
//     if(iconFile.size !== 0){
//       fs.readFile(iconFile.path, function(err, data){
//         if(err) {
//           return res.send('读取文件失败');
//         }
//         var theFile = new AV.File(iconFile.originalFilename, data);
//         var todo = new Todo();


//         theFile.save().then(function(theFile){
//           res.send('上传成功！');
//           console.log(theFile.url(),'123');

//           todo.set('image',theFile.url());

//           var content = fields.content[0];
//           var dizhi = fields.dizhi[0];
//           var time = fields.time[0];
//           var cishu = fields.cishu[0];


// console.log(dizhi,'333')
//           todo.set('name',content);
//           todo.set('dizhi',dizhi)
//           todo.set('time',time);
//           todo.set('cash',Number(cishu))
//           todo.save();
//                 res.redirect('/todos')

//         }).catch(console.error);
//       });
//     } 
//     else {
//       res.send('请选择一个文件。');
//     }
//   });

//  // todo.set('name',content)
//  //      // todo.set('image',theFile.url())

//  //    todo.save().then(function(todo){
//  //      res.redirect('/todos')
//  //    })



// });


module.exports = router;