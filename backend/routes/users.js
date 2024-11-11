const express = require("express");
const db = require("../db"); // A conexão com o banco de dados
const router = express.Router();

// Rota para adicionar um novo usuário
router.post("/usuarios", (req, res) => {
  const { name, caderno_id } = req.body;

  // Verifica se os dados estão presentes
  if (!name || !caderno_id) {
    return res
      .status(400)
      .json({ message: "Nome e caderno_id são obrigatórios" });
  }

  const query = "INSERT INTO users (name, caderno_id) VALUES (?, ?)";
  db.query(query, [name, caderno_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao salvar o usuário", error: err });
    }
    res.status(201).json({
      message: "Usuário criado com sucesso",
      user_id: result.insertId,
    });
  });
});

// Nova rota para retornar todos os usuários
router.get("/usuarios", (req, res) => {
  const query =
    "SELECT u.user_id, u.name, u.caderno_id, c.cor AS caderno_cor FROM users u JOIN cadernos c ON u.caderno_id = c.caderno_id";

  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao carregar os usuários", error: err });
    }
    res.status(200).json(results);
  });
});

// Rota para deletar um usuário
router.delete("/usuarios/:user_id", (req, res) => {
  const { user_id } = req.params;

  // Verifica se o user_id foi passado
  if (!user_id) {
    return res.status(400).json({ message: "user_id é obrigatório" });
  }

  // Primeiro, exclui as respostas associadas ao usuário
  const deleteResponsesQuery = "DELETE FROM respostas WHERE user_id = ?";

  db.query(deleteResponsesQuery, [user_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erro ao excluir as respostas", error: err });
    }

    // Agora exclui o usuário
    const deleteUserQuery = "DELETE FROM users WHERE user_id = ?";

    db.query(deleteUserQuery, [user_id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao deletar o usuário", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      res
        .status(200)
        .json({ message: "Usuário e respostas deletados com sucesso" });
    });
  });
});

module.exports = router;
