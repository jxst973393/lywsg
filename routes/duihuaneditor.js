'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var fs = require('fs');
var multiparty = require('multiparty');
var mod = require('./todos.js');



var Todo = AV.Object.extend('duihuan');


router.get('/', function(req, res, next) {
    let id = req.query.id;
    res.locals.id = id;


    console.log(id, '123');

    var query = new AV.Query(Todo);

    query.get(id).then(function(results) {
            // console.log(results.get('nickName'),'000');

            res.render('duihuaneditor.html', {
                title: '活动信息',
                lists: results,
                user: req.currentUser,

            })


        },

        function(err) {
            res.redirect('/users/login.html');

        }
    );

});


router.post('/', function(req, res, next) {


    // var content = req.body.content;
    // var todo = new Todo();
    // todo.set('content', content);
    // todo.save().then(function(todo) {
    //   res.redirect('/todos');
    // }).catch(next);

    // let id = req.query.id;

    // var name = req.body.name;
    // var content = req.body.objectId;

    var content = req.body.objectId

    console.log(content, 'sqk')

    // var query = new AV.Query(Todo);
    // query.find().then(function(results){
    //     // console.log(results,'666')

    //     for (var item in results){
    //     // console.log(results[item].get('objectId'),'000')


    //     }

    // });
    var name = req.body.name;

    var dizhi = req.body.dizhi;

    var cash = req.body.cash;

    var duihuan = req.body.duihuan;

    var time = req.body.time;



    console.log(name);
    console.log(dizhi);
    console.log(cash);
    console.log(duihuan);
    console.log(time);

    // var todo = new Todo();
    var todo = AV.Object.createWithoutData('duihuan', content);

    todo.set('name', name);
    todo.set('dizhi', dizhi);
    todo.set('phonenumber', cash);
    todo.set('username', duihuan);
    todo.set('time', time);
    // todo.set('yz', true);
    // todo.set('zzz', '已验证');
    todo.save().then(function(results) {
        res.redirect('/duihuan.html');
    }).catch(next);



});

module.exports = router;