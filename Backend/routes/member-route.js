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
const member = model.member

//import sequelize op => digunakan untuk find
const Sequelize = require("sequelize");
const Op = Sequelize.Op

//import multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// //import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const res = require("express/lib/response")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

//konfigurasi storage image, destination dan filename
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "./image/member")
//     },
//     filename: (req, file, cb => {
//         cb(null, "img-" + Date.now() + path.extname(file.originalname))
//     })
// })
// let upload = multer({storage: storage})


//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", (req,res) => {
    member.findAll()
        .then(result => {
            res.json({
                count: result.length,
                member : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
//GET ADMIN by ID, METHOD: GET, FUNCTION: findOne
app.get("/tampil/:id_member", (req, res) => {
    let param = {
        id_member : req.params.id_member
    }
    member.findOne({where: param})
        .then(result => {
            res.json({
                member: result})
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
            gender: req.body.gender,
            phone: req.body.phone,
            username: req.body.username,
            password: req.body.password
        }
     
        member.create(data)
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
app.put("/:id_member", (req,res) => {
    let param = {
        id_member : req.params.id_member
    }
    let data = {
        nama : req.body.nama,
        gender: req.body.gender,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password
    }
    member.update(data, {where: param})
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
app.delete("/:id_member", (req,res) => {
    let param = {
        id_member : req.params.id_member
    }
    member.destroy({where: param})
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
     
app.post("/search", async (req,res)=>{
    let keyword = req.body.keyword
    let result = await member.findAll({
        where: {
            [Op.or]: [
                {
                    id_member: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    gender: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    phone: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    username: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        member: result
    })
    })

     
    //eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbl9pZCI6NCwibmFtZSI6InJha2EiLCJ1c2VybmFtZSI6ImFkbWluUmFrYSJ9.5hF93OntkIdIAHZk0fH7LAfCqxehmncUZvwH7npH2Xc
module.exports = app