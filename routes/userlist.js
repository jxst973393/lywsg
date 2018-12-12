'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var fs = require('fs');
var multiparty = require('multiparty');



var Todo = AV.Object.extend('_User');

// 查询 Todo 列表
// router.get('/', function(req, res, next) {

//     var query = new AV.Query(Todo);
//     // query.descending('updatedAt');

//     query.find().then(function(results) {

//         // console.log(results,'err');


//         res.render('userlist', {
//                 title: '用户列表',
//                 lists: results,
//                 user: req.currentUser,
//             }

//             // console.log(results.name,'666')

//         );
//     }, function(err) {
//         if (err.code === 101) {
//             res.redirect('/users/register?errMsg=' + err.message);

//             // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
//             // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
//             res.render('userlist', {
//                 // title: 'TODO 列表',
//                 lists: [],
//             });

//             res.redirect('/users/register?errMsg=' + err.message);

//         } else {
//             next(err);
//         }
//     }).catch(next);
// });

router.get('/', function(req, res, next) {
    /**
     *     分页
     *     limit(Number):限制获取的数据条数
     *     skip(Number):忽略数据的条数
     *
     *     每页显示两条数据,假设每页限制显示2条数据；
     *     第1页：1-2 s
     *     第2页：3-4 skip（2）忽略第一页的2条数据；
     *     第3页：3-4 skip（4）忽略前两页的4条数据；
     *     忽略数=（当前页-1）*limit 实现分页；
     */
    var query = new AV.Query(Todo);
    var now = new Date();
    query.lessThanOrEqualTo('createdAt', now); //查询今天之前创建的 Todo
    query.limit(10);
    // query.descending('createdAt');
    query.descending('updatedAt');


    var page = Number(req.query.page) || 1 //当前页,前端用户通过get传递过来的页数，或没有传递时默认当前页数为1；
    var limit = 10 //每页显示的条数；
    //获取总条数；
    query.count().then(function(count) {
        // console.log(pages,'pages')
        //计算总页数；
        var pages = Math.ceil(count / limit)
        //当前页不能大于总页数；
        page = Math.min(page, pages)
        //当前页不能小于1
        page = Math.max(page, 1)

        var skip = (page - 1) * limit; //忽略数
        /**
         *     从数据库中读取所有的用户数据
         User.find().limit(limit).skip(skip).then(function (users)
         * */

        var id = req.query.page
        // let id = req.query.id;
        res.locals.page = id;

        var ppp = Number(id) + 1;
        console.log(ppp, '12');

        console.log(id, '123');

        // console.log(oo,'00')
        query.find().then(function(results) {

            if (page == 1) {

                res.render('userlist.html', {
                    title: '用户列表',
                    lists: results,
                    user: req.currentUser,
                    page: page,
                    count: count,
                    pages: pages,
                    limit: limit,
                })
            }
            if (page == 2) {

                query.skip(10); // 跳过 11 条结果
                query.find().then(function(results) {
                    res.render('userlist.html', {
                        title: '用户列表',
                        lists: results,
                        user: req.currentUser,
                        page: page,
                        count: count,
                        pages: pages,
                        limit: limit,
                    })
                })

            }

            if (page == id && id > 2) {
                var ccc = 10;
                var ddd = Number(ccc) * Number(id);

                query.skip(Number(ddd)-Number(10));
                query.find().then(function(results) {
                    res.render('userlist.html', {
                        title: '用户列表',
                        lists: results,
                        user: req.currentUser,
                        page: page,
                        count: count,
                        pages: pages,
                        limit: limit,
                    })
                })
            }

            // if (page == id && id > 2){

            //   var  ccc = 10;
            //   var ddd = Number(ccc) * Number(id); // 9


            //     query.skip(Number(ddd));// 跳过 11 条结果
            //     query.find().then(function(results) {
            //        res.render('userlist', {
            //     title: '用户列表',
            //     lists: results,
            //     user: req.currentUser,
            //     page: page,
            //     count: count,
            //     pages: pages,
            //     limit: limit,
            // })
            //     })

            // }


            if (page < 0) {
                res.render('/userlist.html')
            }
            // if (id > pages) {
            //     // res.send('没有内容了');
            //     res.redirect("/userlist");
                
            // }
            // console.log(users)

        })

    })


});


// router.post('/', function(req, res, next) {

// var content = req.body.butt;

// //  var x = 5;
// // var fn = function (value) {
// //     return value + x;
// // };
// // global.warning = true;

// // module.exports = fn;

// // console.log(content,'76')

//  // var shouji = new AV.Query(Todo);
//  //   var status = req.query.status;

//  //   var ccc = new AV.Query(Todo);

//  //   shouji.equalTo('shouji',content);

//  //   ccc.equalTo('nickName',content);

//   var aaa = new AV.Query(Todo);

//    // query.set('nickName',content);


//    aaa.find().then(function(results){



//  for (var iteam in results){
//   var object3 = results[iteam].get('objectId');

//     // console.log(object3,'777')

//     app.globalData.param = object3

//     // console.log(object3,'666')
// }


// // console.log(results,'errr')

//    })




// });


router.post('/', function(req, res, next) {

    var content = req.body.content;


    console.log(content, '76')

    var shouji = new AV.Query(Todo);
    var status = req.query.status;

    var ccc = new AV.Query(Todo);

    shouji.equalTo('shouji', content);

    ccc.equalTo('nickName', content);

    var query = AV.Query.or(ccc, shouji);

    // var query = new AV.Query(Todo);

    // query.equalTo('shouji',content);

    // query.equalTo('nickName',content);


    query.find().then(function(results) {

        console.log(results, '0909')

        console.log(results[0].get('shouji'), '777');
        console.log(results[0].get('nickName'), '777')

        res.render('userlist.html', {
                title: '用户列表',
                lists: results,



            }

            // console.log(results.name,'666')

        );

    })

    // var query = new AV.Query(Todo);

    //  // query.equalTo('shouji',content);

    //  query.equalTo('shouji',content);


    //   query.find().then(function(results){

    //   console.log(results,'0909')

    //        console.log(results[0].get('shouji'),'777');
    //        console.log(results[0].get('nickName'),'777')

    //    res.render('userlist', {
    //      title: '用户列表',
    //      lists: results,



    //    }

    //    // console.log(results.name,'666')

    //    );

    //   })





});




module.exports = router;