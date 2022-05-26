//import library
const express = require('express');
const bodyParser = require('body-parser');
// const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
//import model
const model = require('../models/index');
// const req = require("express/lib/request");
const outlet = model.outlet

//import sequelize op
const Sequelize = require("sequelize");
const Op = Sequelize.Op

//endpoint menampilkan semua data admin, method: GET, function: findAll()
app.get("/", (req,res) => {
    outlet.findAll()
        .then(result => {
            res.json({
                count: result.length,
                outlet : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
//GET ADMIN by ID, METHOD: GET, FUNCTION: findOne
app.get("/tampil/:id_outlet", (req, res) => {
    let param = {
        id_outlet : req.params.id_outlet
    }
    outlet.findOne({where: param})
        .then(result => {
            res.json({
                outlet: result})
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
        alamat : req.body.alamat,
        phone: req.body.phone
    }
 
    outlet.create(data)
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
app.put("/:id_outlet", (req,res) => {
    let param = {
        id_outlet : req.params.id_outlet
    }
    let data = {
        nama : req.body.nama,
        alamat : req.body.alamat,
        phone: req.body.phone
    }
    outlet.update(data, {where: param})
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
app.delete("/:id_outlet", (req,res) => {
    let param = {
        id_outlet : req.params.id_outlet
    }
    outlet.destroy({where: param})
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

//search admin by name & username, method: post
app.post("/search", async (req,res)=>{
    let keyword = req.body.keyword
    let result = await outlet.findAll({
        where: {
            [Op.or]: [
                {
                    id_outlet: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    alamat: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    phone: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        outlet: result
    })
    })

    
    //eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbl9pZCI6NCwibmFtZSI6InJha2EiLCJ1c2VybmFtZSI6ImFkbWluUmFrYSJ9.5hF93OntkIdIAHZk0fH7LAfCqxehmncUZvwH7npH2Xc
module.exports = app