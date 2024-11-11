const express = require("express");
const db = require("../db"); // A conexão com o banco de dados
const router = express.Router();

// Rota para buscar todas as cores de cadernos
router.get("/cadernos", (req, res) => {
  const query = "SELECT caderno_id, cor FROM cadernos";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Erro ao buscar cadernos", error: err });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
