var express = require('express');
var router = express.Router();
var connection = require('../library/database');
const fs = require('fs');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const destinationPath = 'public/images';
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }
        callback(null, destinationPath);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/addProduct', function(req, res) {
    res.render('addProduct', {
        action: '/store',
        nama_barang: '',
        harga_barang: '',
        deskripsi_barang: '',   
        jenis_barang: '',
        gambar_barang: ''
    })
});

router.post('/store', upload.single('gambar_barang'), function(req, res, next) {
    let nama_barang = req.body.nama_barang
    let harga_barang = req.body.harga_barang
    let deskripsi_barang = req.body.deskripsi_barang
    let jenis_barang = req.body.jenis_barang
    let gambar_barang = req.file ? req.file.originalname : '';
    let errors      = false

    if(nama_barang.length === 0 || harga_barang.length === 0 || jenis_barang.length === 0 || deskripsi_barang.length === 0 || gambar_barang.length === 0) {
        errors = true
        req.flash('error', 'Invalid input data')
        res.render('addProduct', {
            nama_barang: nama_barang,
            harga_barang: harga_barang,
            deskripsi_barang: deskripsi_barang,
            jenis_barang: jenis_barang,
            gambar_barang: gambar_barang
        })
    }

    if(!errors) {
        let formData = {
            nama_barang: nama_barang,
            harga_barang: harga_barang,
            deskripsi_barang: deskripsi_barang,
            jenis_barang: jenis_barang,
            gambar_barang: gambar_barang
        }
        connection.query('INSERT INTO toko_naufal SET ?', formData, function(error, result) {
            if(error) {
                req.flash('error', error)
                res.render('addProduct', {
                    nama_barang: formData.nama_barang,
                    harga_barang: formData.harga_barang,
                    deskripsi_barang: formData.deskripsi_barang,
                    jenis_barang: formData.jenis_barang,
                    gambar_barang: formData.gambar_barang
                })
            }else {
                req.flash('Berhasil', 'Data Tersimpan');
                res.redirect('/')
            }
        })
    }
});

router.get('/editProduct/:idData', function(req, res, next) {
    let idData = req.params.idData

    connection.query(`SELECT * FROM toko_naufal WHERE id = ${idData}`, function(error, rows) {
        if(error) throw error

        if(rows.length <= 0) {  // Perbaikan disini
            req.flash('Error', `Data dengan ID ${idData} tidak ditemukan`);
            res.redirect('/')
        } else {
            res.render('addProduct', { 
                action: `/update/${idData}`,
                nama_barang: rows[0].nama_barang,
                harga_barang:  rows[0].harga_barang,
                deskripsi_barang:  rows[0].deskripsi_barang,
                jenis_barang:  rows[0].jenis_barang,
                gambar_barang:  rows[0].gambar_barang
            });
        }
    });
});


router.post('/update/:idData', upload.single('gambar_barang'), function(req, res, next) {
    let idData = req.params.idData
    let nama_barang = req.body.nama_barang
    let harga_barang = req.body.harga_barang
    let deskripsi_barang = req.body.deskripsi_barang
    let jenis_barang = req.body.jenis_barang
    let errors = false

    if (nama_barang.length === 0 || harga_barang.length === 0 || jenis_barang.length === 0 || deskripsi_barang.length === 0) {
        errors = true
        req.flash('error', 'Invalid input data')
        return res.render('addProduct', {
            nama_barang: nama_barang,
            harga_barang: harga_barang,
            deskripsi_barang: deskripsi_barang,
            jenis_barang: jenis_barang,
        })
    }

    connection.query(`SELECT gambar_barang FROM toko_naufal WHERE id = ${idData}`, function(error, results) {
        if (error) {
            req.flash("error", error);
            return res.render("addProduct", {
                nama_barang: nama_barang,
                harga_barang: harga_barang,
                deskripsi_barang: deskripsi_barang,
                jenis_barang: jenis_barang,
            });
        }
    
        let prevgambarbarang = results[0].gambar_barang
    
        if (prevgambarbarang) {
            if (fs.existsSync(prevgambarbarang)) {
                fileSystem.unlinkSync(prevgambarbarang);
            } else {
                console.error(`File '${prevgambarbarang}' not found.`);
            }
        }

        let formData = {
            nama_barang: nama_barang,
            harga_barang: harga_barang,
            deskripsi_barang: deskripsi_barang,
            jenis_barang: jenis_barang,
        }

        if (req.file) {
            formData.gambar_barang = req.file.originalname
        }

        connection.query(`UPDATE toko_naufal SET ? WHERE id = ${idData}`, formData, function(error, result) {
            if (error) {
                req.flash('error', error)
                return res.render('addProduct', {
                    nama_barang: formData.nama_barang,
                    harga_barang: formData.harga_barang,
                    deskripsi_barang: formData.deskripsi_barang,
                    jenis_barang: formData.jenis_barang,
                    gambar_barang: formData.gambar_barang
                })
            } else {
                req.flash('berhasil', 'barang berhasil di update');
                return res.redirect('/')
            }
        })
    })
});


module.exports = router