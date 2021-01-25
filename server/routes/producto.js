const express = require("express");
const { verificaToken } = require("../middlewares/autenticacion");

let app = express();

let Producto = require("../models/producto");

// OBTENER TODOS LOS PRODUCTOS

app.get("/productos", verificaToken, (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Producto.find({ disponible: true })
    .skip(desde)
    .sort("nombre")
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });

  //trae todos los productos
  //populate: usuario, y categoria
  //paginado
});

// OBTENER PRODUCTO POR ID

app.get("/productos/:id", verificaToken, (req, res) => {
  //populate: usuario, y categoria
  let id = req.params.id;

  Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "El ID no es valido",
          },
        });
      }
      res.json({
        ok: true,
        producto: productoDB,
      });
    });
});

// BUSQUEDA DE PRODUCTOS

app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});

// CREAR PRODUCTO

app.post("/productos", verificaToken, (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.status(201).json({
      ok: true,
      producto: productoDB,
    });
  });
  //grabar el usuario
  //grabar una categoria del listado
});

// ACTUALIZAR PRODUCTO

app.put("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "El producto no es valido",
        },
      });
    }

    productoDB.nombre = body.nombre;
    productoDB.precioUni = body.precioUni;
    productoDB.categoria = body.categoria;
    productoDB.disponible = body.disponible;
    productoDB.descripcion = body.descripcion;

    productoDB.save((err, productoActualizado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        producto: productoActualizado,
      });
    });
  });
});

// DESHABILITAR UN PRODUCTO

app.delete("/productos/:id", verificaToken, (req, res) => {
  let id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "ID no existe",
        },
      });
    }

    productoDB.disponible = false;

    productoDB.save((err, productoDeshabilitado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        producto: productoDeshabilitado,
        mensaje: "Producto deshabilitado",
      });
    });
  });
});

module.exports = app;
