global.express = require('express');
var router = express.Router();
var model = require('../models');
var User = model.tbluser;
var Parent = model.tbluser;
var Country = model.tblcountry;
var State = model.tblstate;
var City = model.tblcity;
var _ = require('underscore');
const Sequelize = require('sequelize');
var sequelize = model.sequelize
const op = Sequelize.Op;

router.get('/getAllUser', function(req, res) {
    var query = "SELECT tu.*,tc.country,ts.state,tci.city,tp.username as ParentName FROM " +
        "tbluser as tu " +
        "INNER JOIN tblcountry as tc on tc.id=tu.country " +
        "INNER JOIN tblstate as ts on ts.id=tu.state " +
        "INNER JOIN tblcity as tci on tci.id=tu.city " +
        "LEFT JOIN tbluser as tp on tp.id=tu.parentid " +
        "WHERE NOT tu.role='1'";
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function(response) {
        if (response != null) {
            res.json({
                success: true,
                message: "Success",
                data: response
            });
        } else {
            res.json({
                success: false,
                message: "No Data Found",
                data: []
            });
        }
    })
})
router.post('/login', jsonParser, function(req, res) {
    var obj = req.body;
    var pwd = jwt.encode(obj.password, token);
    User.findOne({
        where: {
            username: obj.username,
            password: pwd
        }
    }).then(function(response) {
        if (response != null) {
            res.json({
                success: true,
                message: "Successfully Logged IN",
                data: response
            });
        } else {
            res.json({
                success: false,
                message: "Invalid Login Credentials",
                data: null
            });
        }
    })
})
router.post('/registeruser', jsonParser, function(req, res) {
    var objData = req.body;
    objData.password = jwt.encode(objData.password.trim(), token);
    if (objData.id == 0 || objData.id == null) {
        User.findAll({
            where: {
                username: objData.username
            }
        }).then(function(resUser) {
            if (resUser.length != 0) {
                res.json({
                    success: false,
                    message: "UserName Already Exists",
                    data: null
                });
            } else {
                User.create(objData).then(function(data) {
                    if (data != null) {
                        res.json({
                            success: true,
                            message: "Successfully Created New Record",
                            data: data
                        });
                    }
                })
            }
        })
    }
})

router.get('/getAllCountry', function(req, res) {
    Country.findAll().then(function(resCountry) {
        if (resCountry.length > 0) {
            res.json({
                success: true,
                message: "Success",
                data: resCountry
            })
        } else {
            res.json({
                success: false,
                message: "No Data",
                data: []
            })
        }
    })
})
router.get('/getAllStateByCountry', function(req, res) {
    State.findAll({
        where: {
            country: req.query.country
        }
    }).then(function(resState) {
        if (resState.length > 0) {
            res.json({
                success: true,
                message: "Success",
                data: resState
            })
        } else {
            res.json({
                success: false,
                message: "No Data",
                data: []
            })
        }
    })
})
router.get('/getAllCityByState', function(req, res) {
    City.findAll({
        where: {
            state: req.query.state
        }
    }).then(function(resCity) {
        if (resCity.length > 0) {
            res.json({
                success: true,
                message: "Success",
                data: resCity
            })
        } else {
            res.json({
                success: false,
                message: "No Data",
                data: []
            })
        }
    })
})

router.get('/getTree', function(req, res) {

    var query = "SELECT tu.*,tc.country,ts.state,tci.city,tp.username as ParentName FROM " +
        "tbluser as tu " +
        "INNER JOIN tblcountry as tc on tc.id=tu.country " +
        "INNER JOIN tblstate as ts on ts.id=tu.state " +
        "INNER JOIN tblcity as tci on tci.id=tu.city " +
        "LEFT JOIN tbluser as tp on tp.id=tu.parentid " +
        "WHERE NOT tu.role='1'";
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT }).then(function(resUser) {
        resUser = JSON.parse(JSON.stringify(resUser));
        var parentid = req.query.userid
        var lstChild = _.filter(resUser, function(ob) {
            return ob.parentid == parentid;
        });
        var lstUser = [];
        callRecursionFunction(lstChild, function(response) {

            res.json(lstUser);
        });

        function callRecursionFunction(lstChild, callback) {

            function callfunction(k) {
                if (k < lstChild.length) {
                    var objUser1 = _.findWhere(resUser, { id: parseInt(lstChild[k].id) });
                    objUser1.children = [];

                    lstUser.push(objUser1);
                    var lstChild1 = [];
                    lstChild1 = _.filter(resUser, { parentid: objUser1.id });
                    if (lstChild1.length > 0) {
                        AddChilds(0);

                        function AddChilds(l) {
                            if (l < lstChild1.length) {
                                AddChilds(l + 1);
                            } else {
                                callRecursionFunction(lstChild1, function(response) {
                                    callfunction(k + 1);
                                });
                            }
                        }
                    } else {
                        callfunction(k + 1);
                    }
                } else {
                    return callback();
                }
            }
            callfunction(0);
        }
    })
})
router.get('/getAllUserName', function(req, res) {
    User.findAll({
        where: {
            role: 2
        },
        attributes: ['id', 'username']

    }).then(function(resUserList) {
        res.json({
            success: true,
            message: "Success",
            data: resUserList
        })
    })
})


module.exports = router