const express = require("express");
const db = require("../db");

const router = express.Router();

// Rota para pegar as questões de um caderno junto com a resposta correta
router.get("/:cadernoId", (req, res) => {
  const { cadernoId } = req.params;

  db.query(
    `
    SELECT 
      q.questao_id,
      q.numero,
      q.caderno_id,
      o.opcao_id,
      o.letra AS resposta_correta
    FROM 
      questoes q
    LEFT JOIN 
      opcoes o 
    ON 
      q.questao_id = o.questao_id
    WHERE 
      q.caderno_id = ? AND o.letra IS NOT NULL
    ORDER BY 
      q.numero ASC
    `,
    [cadernoId],
    (err, result) => {
      if (err) {
        console.error("Erro ao buscar questões:", err);
        return res.status(500).json({ message: "Erro ao buscar questões." });
      }
      res.json(result);
    }
  );
});

// Rota para adicionar uma nova questão
router.post("/adicionar-questao", (req, res) => {
  const { caderno_id, numero, letra } = req.body;

  if (!caderno_id || !numero || !letra) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  // Inserir a nova questão na tabela 'questoes'
  db.query(
    `
    INSERT INTO questoes (caderno_id, numero)
    VALUES (?, ?)`,

    [caderno_id, numero],
    (err, result) => {
      if (err) {
        console.error("Erro ao inserir questão:", err);
        return res
          .status(500)
          .json({ message: "Erro ao adicionar nova questão." });
      }

      const questao_id = result.insertId;

      // Inserir a alternativa correta na tabela 'opcoes'
      db.query(
        `
        INSERT INTO opcoes (questao_id, letra)
        VALUES (?, ?)`,

        [questao_id, letra],
        (err2, result2) => {
          if (err2) {
            console.error("Erro ao inserir alternativa:", err2);
            return res
              .status(500)
              .json({ message: "Erro ao adicionar alternativa." });
          }

          res.status(201).json({ message: "Questão adicionada com sucesso!" });
        }
      );
    }
  );
});

// Rota para deletar uma questão
router.delete("/deletar-questao/:questaoId", (req, res) => {
  const { questaoId } = req.params;

  // Deletar as respostas relacionadas à questão
  db.query(
    `DELETE FROM respostas WHERE questao_id = ?`,
    [questaoId],
    (err0) => {
      if (err0) {
        console.error("Erro ao deletar respostas:", err0);
        return res.status(500).json({ message: "Erro ao deletar respostas." });
      }

      // Deletar as alternativas da questão (opções)
      db.query(
        `DELETE FROM opcoes WHERE questao_id = ?`,
        [questaoId],
        (err1) => {
          if (err1) {
            console.error("Erro ao deletar alternativa:", err1);
            return res
              .status(500)
              .json({ message: "Erro ao deletar alternativa." });
          }

          // Deletar a questão
          db.query(
            `DELETE FROM questoes WHERE questao_id = ?`,
            [questaoId],
            (err2) => {
              if (err2) {
                console.error("Erro ao deletar questão:", err2);
                return res
                  .status(500)
                  .json({ message: "Erro ao deletar questão." });
              }

              res
                .status(200)
                .json({ message: "Questão deletada com sucesso!" });
            }
          );
        }
      );
    }
  );
});

// Rota para atualizar uma questão
router.put("/atualizar-questao/:questaoId", (req, res) => {
  const { questaoId } = req.params;
  const { numero, letra } = req.body;

  if (numero == null || letra == null) {
    return res
      .status(400)
      .json({ message: "O número e a alternativa são obrigatórios." });
  }

  // Atualizar o número da questão na tabela 'questoes'
  db.query(
    `UPDATE questoes SET numero = ? WHERE questao_id = ?`,
    [numero, questaoId],
    (err1) => {
      if (err1) {
        console.error("Erro ao atualizar número da questão:", err1);
        return res
          .status(500)
          .json({ message: "Erro ao atualizar número da questão." });
      }

      // Atualizar a alternativa (letra) na tabela 'opcoes'
      db.query(
        `UPDATE opcoes SET letra = ? WHERE questao_id = ?`,
        [letra, questaoId],
        (err2) => {
          if (err2) {
            console.error("Erro ao atualizar alternativa:", err2);
            return res
              .status(500)
              .json({ message: "Erro ao atualizar alternativa." });
          }

          // Atualizar o status 'is_correct' nas respostas dos usuários para a questão atualizada
          db.query(
            `
            UPDATE respostas
            SET is_correct = CASE WHEN alternativa_marcada = ? THEN 1 ELSE 0 END
            WHERE questao_id = ?
            `,
            [letra, questaoId],
            (err3) => {
              if (err3) {
                console.error("Erro ao atualizar o status da resposta:", err3);
                return res
                  .status(500)
                  .json({ message: "Erro ao atualizar o status da resposta." });
              }

              res.status(200).json({
                message: "Questão e respostas atualizadas com sucesso!",
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
