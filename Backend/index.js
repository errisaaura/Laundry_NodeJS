
//import
const express = require('express');
const cors = require('cors')

//implementasi
const app = express();
app.use(cors())

app.use(express.static(__dirname))

const admin = require("./routes/admin-route")
app.use("/admin", admin)

const outlet = require("./routes/outlet-route")
app.use("/outlet", outlet)

const member = require("./routes/member-route")
app.use("/member", member)

const paket = require("./routes/paket-route")
app.use("/paket", paket)

const transaksi = require("./routes/transaksi-route")
app.use("/transaksi", transaksi)

//run server
app.listen(8000, () => {
    console.log('server run on port 8000')
})