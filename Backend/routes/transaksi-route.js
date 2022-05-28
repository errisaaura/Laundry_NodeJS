//import library
const express = require ("express")
const app = express()
app.use(express.json())

//import model
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi

//import sequelize op
const Sequelize = require("sequelize")
const Op = Sequelize.Op


// //JIKA BELUM LUNAS TANGGAL BAYAR TETEP NULL/LANGSUNG TERISI NULL

//ini untuk menampilkan semua transaksi
app.get("/", async (req, res) =>{
    try {
        let result = await transaksi.findAll({
            include: [
                "member","outlet","admin",
                {
                    model: detail_transaksi,
                    as : "detail_transaksi",
                    include: ["paket"]
                }
            ],
            order: [['createdAt', 'DESC']]
        })
        res.json({
            count: result.length,
            transaksi: result
        })
    } catch (err) {
        console.error(err);
        res.json(err);
    }
})

//ini menampilkan transaksi by id transaksi
app.get ("/transaksi/:id_transaksi", async (req,res) => {
    let param = { id_transaksi: req.params.id_transaksi}
    let result = await transaksi.findAll({
        where: param,
        include: [
            "member",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as : "detail_transaksi",
                include: ["paket"]
            }
        ]
    })
    let sumTotal = await transaksi.sum("total", {
        where : param
    })
    res.json({
        transaksibyid_transaksi: result,
        sumTotal : sumTotal
    })
})

//ini menampilkan transaksi by id_outlet
app.get ("/:id_outlet", async (req,res) => {
    let param = { id_outlet : req.params.id_outlet}
    let result = await transaksi.findAll({
        where: param,
        include: [
            "member",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as : "detail_transaksi",
                include: ["paket"]
            }
        ],
        order: [['createdAt', 'DESC']]

    })
     let sumTotal = await transaksi.sum("total", {
         where: param
     })
    res.json({
        count: result.length,
        transaksibyOutlet_id: result,
        sumTotal: sumTotal
    })
})

//ini menambahkan transaksi 
app.post("/", async (req,res) => {
    let current = new Date().toISOString().split('T')[0]
    let data = {
        id_member: req.body.id_member,//siapa customer yang beli
        id_admin: req.body.id_admin,
        id_outlet: req.body.id_outlet,
        tgl: current,//current : 
        batas_waktu: req.body.batas_waktu,
        tgl_bayar: req.body.tgl_bayar,
        status: req.body.status,
        payment: req.body.payment,
        total: req.body.total
    }
    transaksi.create(data)
    .then(result => {
        let lastID = result.id_transaksi
        console.log(lastID)
        detail = req.body.detail_transaksi
        detail.forEach(element => {//perungalan barang yang ada pada detail disimpan dalam element
            element.id_transaksi = lastID
        });
        console.log(detail);
        detail_transaksi.bulkCreate(detail)//bulkCreate create data lebih dari satu kali
        .then(result => {
            res.json({
                message: "Data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        console.log(error.message);
    })
})

//ini untuk update transaksi berdasarkan id
app.put("/:id_transaksi", (req, res) =>{
    let param = { id_transaksi: req.params.id_transaksi}
    let data = {
        batas_waktu: req.body.batas_waktu,
        tgl_bayar: req.body.tgl_bayar,
        status: req.body.status,
        payment: req.body.payment
       
    }
    transaksi.update(data, {where: param})
    .then(result => {
        res.json({
            message: "Data has been Updated"
        })
    })
    .catch( error => {
        res.json({
            message: error.message
        })
    })
})

//ini untuk menghapus transaksi
app.delete("/:id_transaksi", async (req, res) =>{
    let param = { id_transaksi: req.params.id_transaksi}
    try {
        await detail_transaksi.destroy({where: param})//menghapus detail dulu atau anak 
        await transaksi.destroy({where: param})//baru selanjutnya hapus yang parent kalau insert sebaliknya
        res.json({
            message : "data has been deleted"
        })
    } catch (error) {
        res.json({
            message: error
        })
    }
})

//ini untuk search pada laporan transaksi itu
app.post ("/date/:id_outlet", async (req, res) =>{
    let start = new Date(req.body.start)
    let end = new Date(req.body.end)

    let result = await transaksi.findAll({
        where: {
            id_outlet: req.params.id_outlet,
            // payment: "Lunas"

            tgl: {
                [Op.between]: [
                    start, end
                ]
            }
        },
        include: [
            "member",
            "admin",
            "outlet",
            {
                model: models.detail_transaksi,
                as : "detail_transaksi",
                include: ["paket"]
            }
        ],
        order: [['createdAt', 'DESC']],

    })
    let sumTotal = await transaksi.sum("total", {
        where: {
            id_outlet: req.params.id_outlet,
            tgl: {
                [Op.between]: [
                    start, end
                ]
            }
        }
    });
    res.json({
        count: result.length,
        transaksi: result,
        sumTotal: sumTotal
    })
})



module.exports = app
