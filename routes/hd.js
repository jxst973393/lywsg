'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var fs = require('fs');
var multiparty = require('multiparty');



var Todo = AV.Object.extend('list');

// 查询 Todo 列表
router.get('/hd', function(req, res, next) {
    var query = new AV.Query(Todo);
    query.descending('createdAt');
    query.find().then(function(results) {

        // console.log(results,'err');

        res.render('hds/hd.html', {
                title: '运营案例',
                lists: results,
                user: req.currentUser,


            }

            // console.log(results.name,'666')

        );
    }, function(err) {
        if (err.code === 101) {
            // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
            // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
            res.render('hd', {
                title: 'TODO 列表',
                lists: []
            });
        } else {
            next(err);
        }
    }).catch(next);
});

router.get('/xdhd', function(req, res, next) {

    var query = new AV.Query(Todo);
    query.descending('createdAt');
    query.find().then(function(results) {

        // console.log(results,'err');

res.type('html');
        res.render('hds/xdhd.html', {
                titles: '新的活动',
                lists: results,
                user: req.currentUser,
            }

            // console.log(results.name,'666')

        );
    }, function(err) {
        if (err.code === 101) {
            // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
            // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
            res.render('xdhd', {
                titles: 'TODO 列表',
                lists: []
            });
        } else {
            next(err);
        }
    }).catch(next);
});
// router.post('/', function(req, res, next) {

//     var content = req.body.butt;

//     console.log(content, '76')

//     var query = new AV.Query(Todo);
//     var status = req.query.status;

//     // query.descending('createdAt');
//     query.find().then(function(results) {

//         // console.log(results.attributes,'err');

//         for (var item in results) {
//             // #{<%= lists[item].get("objectId") %>
//             console.log(results[item].get('objectId'), '123')
//             // console.log(item,'123')
//         }

//         var todo = AV.Object.createWithoutData('list', content);
//         todo.destroy().then(function(success) {
//             // res.redirect('/duihuan?status=' + status);
//             res.redirect('/todos');

//         }, function(err) {
//             res.redirect('/todos');
//         }).catch(next);


//     })


// });



module.exports = router;