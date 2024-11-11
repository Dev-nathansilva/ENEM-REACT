require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cadernosRoutes = require("./routes/cadernos");
const usersRoutes = require("./routes/users");
const questoesRoutes = require("./routes/questoes");
const respostasRoutes = require("./routes/respostas");
const app = express();

app.use(cors());
app.use(express.json());

// Rota para cadernos
app.use("/api", cadernosRoutes);

// Rota para usuários
app.use("/api", usersRoutes);

app.use("/api/questoes", questoesRoutes);
app.use("/api", respostasRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
