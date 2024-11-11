const express = require("express");
const db = require("../db");

const router = express.Router();

// Rota para salvar múltiplas respostas de uma vez
router.post("/respostas", (req, res) => {
  const respostas = req.body;

  // Mapeia as respostas para um array de valores
  const valores = respostas.map(
    ({ user_id, questao_id, caderno_id, is_correct, alternativa_marcada }) => [
      user_id,
      questao_id,
      caderno_id,
      is_correct,
      alternativa_marcada,
    ]
  );

  const query = `
    INSERT INTO respostas (user_id, questao_id, caderno_id, is_correct, alternativa_marcada) 
    VALUES ? 
    ON DUPLICATE KEY UPDATE 
      is_correct = VALUES(is_correct), 
      alternativa_marcada = VALUES(alternativa_marcada)
  `;

  db.query(query, [valores], (err, result) => {
    if (err) {
      console.error("Erro ao salvar respostas:", err);
      return res.status(500).json({ message: "Erro ao salvar respostas." });
    }
    res.json({ message: "Respostas salvas com sucesso!" });
  });
});

// Rota para buscar respostas salvas para um usuário e caderno específicos
router.get("/respostas/:userId/:cadernoId", (req, res) => {
  const { userId, cadernoId } = req.params;

  const query = `
    SELECT questao_id, is_correct, alternativa_marcada
    FROM respostas
    WHERE user_id = ? AND caderno_id = ?
  `;

  db.query(query, [userId, cadernoId], (err, results) => {
    if (err) {
      console.error("Erro ao carregar respostas salvas:", err);
      return res
        .status(500)
        .json({ message: "Erro ao carregar respostas salvas." });
    }
    res.json(results);
  });
});

module.exports = router;
