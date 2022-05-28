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
const paket = model.paket

//import sequelize op
const Sequelize = require("sequelize");
const Op = Sequelize.Op

// import multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//ini multer buat up imagenya
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./image/paket")
    },
    filename : (req, file, cb) => {
        cb(null, "img-paket" + Date.now() + path.extname(file.originalname))
    }
    
})
let upload = multer({storage : storage})

//endpoint menampilkan semua data paket, method: GET, function: findAll()
app.get("/", (req,res) => {
    paket.findAll()
        .then(result => {
            res.json({
                count: result.length,
                paket : result
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})
//GET paket by ID, METHOD: GET, FUNCTION: findOne
app.get("/tampil/:id_paket", (req, res) => {
    let param = {
        id_paket : req.params.id_paket
    }
    paket.findOne({where: param})
        .then(result => {
            res.json({
                paket: result})
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })//jika eror masuk ke blok .catch diambil erornya apa dan ditampilkan errornya

})

//endpoint untuk menyimpan data paket, METHOD: POST, function: create
app.post("/", upload.single("image") , (req,res) => {
    let data = {
        nama : req.body.nama,
        price : req.body.price,
        image : req.file.filename
        
    }
 
    paket.create(data)
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

//endpoint mengupdate data paket, METHOD: PUT, function:update
app.put("/:id_paket", upload.single("image") , (req,res) => {
    let param = {
        id_paket : req.params.id_paket
    }
    let data = {
        nama : req.body.nama,
        price : req.body.price,
        
    }

    if(req.file){
        const row = paket.findOne({where : param})
        .then(result => {
            let oldFileName = result.image

            // delete old file
            let dir = path.join(__dirname, "../image/paket", oldFileName)
            fs.unlink(dir, err => console.log(err))
        })
        .catch(error => {
            console.log(error.message);
        })

        //set new filename
        data.image = req.file.filename

    }

    paket.update(data, {where: param})
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

//endpoint menghapus data paket, METHOD: DELETE, function: destroy
app.delete("/:id_paket", async (req,res) => {
    try {
        let param = { id_paket: req.params.id_paket}
        let result = await paket.findOne({where: param})
        let oldFileName = result.image
           
        // delete old file
        let dir = path.join(__dirname,"../image/paket",oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        paket.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

//ini untuk search atau mencari paket by id, nama, and price
app.post("/search", async (req,res)=>{
    let keyword = req.body.keyword
    let result = await paket.findAll({
        where: {
            [Op.or]: [
                {
                    id_paket: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    price: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        }
    })
    res.json({
        paket: result
    })
    })

    
    //eyJhbGciOiJIUzI1NiJ9.eyJhZG1pbl9pZCI6NCwibmFtZSI6InJha2EiLCJ1c2VybmFtZSI6ImFkbWluUmFrYSJ9.5hF93OntkIdIAHZk0fH7LAfCqxehmncUZvwH7npH2Xc
module.exports = app