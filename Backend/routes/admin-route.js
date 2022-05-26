//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
//import model
const model = require('../models/index');
// const req = require("express/lib/request");
const admin = model.admin

//import sequelize op
const Sequelize = require("sequelize");
const Op = Sequelize.Op

// //import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const res = require("express/lib/response")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", async (req,res) => {
    let result = await admin.findAll({
        include: [
            "outlet",
            {
                model : model.outlet,
                as: "outlet"
            }
        ]
    })
    res.json({
        count: result.length,
        admin: result
    })
})
//GET ADMIN by ID, METHOD: GET, FUNCTION: findOne
app.get("/tampil/:id_admin", async (req, res) => {
    let param = {
        id_admin : req.params.id_admin
    }
    let result = await admin.findOne({
        where: param,
        include : [
            "outlet",
            {
                model: model.outlet,
                as : "outlet"
            }
        ]
    })
    res.json({
        admin: result
    })
        

})

//GET ADMIN by outlet_id, METHOD: GET, FUNCTION: findOne
app.get("/:id_outlet", async (req, res) => {
    let param = {
        id_outlet : req.params.id_outlet
    }
    admin.findAll({where: param})
        .then(result => {
            res.json({
                count: result.length,
                admin: result})
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })//jika eror masuk ke blok .catch diambil erornya apa dan ditampilkan errornya

})

//endpoint untuk menyimpan data admin, METHOD: POST, function: create
app.post("/", (req,res) => {
    let data = {
        nama : req.body.nama,
        username : req.body.username,
        password : md5(req.body.password),
        role : req.body.role,
        id_outlet : req.body.id_outlet
    }
 
    admin.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint mengupdate data admin, METHOD: PUT, function:update
app.put("/edit/:id_admin", (req,res) => {
    let param = {
        id_admin : req.params.id_admin
    }
    let data = {
        nama : req.body.nama,
        username : req.body.username,
        // password : md5(req.body.password),
        role : req.body.role,
        id_outlet : req.body.id_outlet
    }
    admin.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data admin, METHOD: DELETE, function: destroy
app.delete("/:id_admin", (req,res) => {
    let param = {
        id_admin : req.params.id_admin
    }
    admin.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

 //endpoint login admin, METHOD: POST, function: findOne
    app.post("/auth", async (req,res) => {
        let data = {
            username: req.body.username,
            password: md5(req.body.password)
        }

        let result  = await admin.findOne({where: data})
        if(result){
            //set payload from data
            let payload = JSON.stringify({
                admin_id: result.admin_id,
                name: result.name,
                username: result.username
            })//convert javascript ke json

            let token = jwt.sign(payload, SECRET_KEY)
            
            res.json({
                logged: true,
                data: result,
                token: token
            })
        }else{

            res.json({
                logged: false,
                message: "Invalid Username or Password"
            })
        }
    })

//search admin by name & username, method: post
app.post("/search", async (req,res)=>{
    let keyword = req.body.keyword
    let result = await admin.findAll({
        where: {
            [Op.or]: [
                {
                    id_admin: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    username: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                
            ]
        }
    })
    res.json({
        admin: result
    })
    })

    //eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbl9pZCI6NCwibmFtZSI6InJha2EiLCJ1c2VybmFtZSI6ImFkbWluUmFrYSJ9.5hF93OntkIdIAHZk0fH7LAfCqxehmncUZvwH7npH2Xc
module.exports = app