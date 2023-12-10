var express = require('express');
var router = express.Router();
var connection = require('../library/database');
var fileSystem = require('fs');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


router.get('/', function(req, res, next) {
    connection.query(`SELECT * FROM toko_naufal ORDER BY id desc`, function(error, rows) {
      if(error) {
        req.flash('Error', error);
        res.render('dashboard', { username: req.session.username, role: req.session.role, data: '', product: 'Semua Produk' })
      } else {
        res.render('dashboard', { username: req.session.username, role: req.session.role, data: rows, product: 'Semua Produk' })
      }
    })
});

router.get('/foods', function(req, res, next) {
    connection.query(`SELECT * FROM toko_naufal WHERE jenis_barang = 'foods' ORDER BY id desc`, function(error, rows) {
      if(error) {
        req.flash('Error', error);
        res.render('dashboard', { username: req.session.username, role: req.session.role, data: '', product: 'Makanan' })
      } else {
        res.render('dashboard', { username: req.session.username, role: req.session.role, data: rows, product: 'Makanan' })
      }
    })
});

router.get('/Drinks', function(req, res, next) {
  connection.query(`SELECT * FROM toko_naufal WHERE jenis_barang = 'Drinks' ORDER BY id desc`, function(error, rows) {
    if(error) {
      req.flash('Error', error);
      res.render('dashboard', { username: req.session.username, role: req.session.role, data: '', product: 'Minuman' })
    } else {
      res.render('dashboard', { username: req.session.username, role: req.session.role, data: rows, product: 'Minuman' })
    }
  })
});

router.get('/delete/:idData', function(req, res) {
  let idData = req.params.idData

  connection.query(`SELECT gambar_barang FROM toko_naufal WHERE id = ${idData}`, function(error, results) {
    if(error) {
      req.flash('error', error);
      res.redirect(`/`);
    }else {
      let deleteImage = results[0].gambar_barang
      if(deleteImage) fileSystem.unlinkSync('public/images/' + deleteImage);

      connection.query(`DELETE FROM toko_naufal WHERE id = ${idData}`, function(error, results) {
        if(error) {
          req.flash('error', error);
          res.redirect(`/`);
        }else {
          req.flash('berhasil', 'Data berhasil di hapus');
          res.redirect(`/`);
        }
      });
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
