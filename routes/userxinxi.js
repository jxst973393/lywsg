'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var fs = require('fs');
var multiparty = require('multiparty');
var mod = require('./userlist.js');



var Todo = AV.Object.extend('_User');


router.get('/', function(req, res, next) {
    let id = req.query.id;
    res.locals.id = id;

    // res.render("userxinxi.ejs");

    console.log(id, '123');

    var query = new AV.Query(Todo);

    query.get(id).then(function(results) {
        // console.log(results.get('nickName'),'000');

        res.render('userxinxi.html', {
            title: '用户信息',
            lists: results,
            user: req.currentUser,

        })


    }, function(err) {
        res.redirect('/users/login.html');

    });

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

    var jifen = req.body.jifen;

    var shouji = req.body.shouji;

    var admin = req.body.admin;

    console.log(jifen);
    console.log(admin);

    // var todo = new Todo();
    var todo = AV.Object.createWithoutData('_User', content);

    todo.set('jifen', Number(jifen));
    todo.set('admin', admin)
    todo.set('shouji', shouji)
    todo.save().then(function(results) {
        res.redirect('/userlist.html');
    }).catch(next);



});

module.exports = router;