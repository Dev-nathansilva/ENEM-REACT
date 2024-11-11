import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const Questoes = () => {
  const baseUrl = "https://backend-enem-production.up.railway.app"; // URL base para o backend
  const location = useLocation();
  const navigate = useNavigate();
  const { name, userId, caderno, cadernoCor } = location.state || {};
  const questoesRefs = useRef({});

  useEffect(() => {
    if (!name || !userId || !cadernoCor || !caderno) {
      navigate("/");
    }
  }, [name, userId, cadernoCor, caderno, navigate]);

  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [contador, setContador] = useState({ corretas: 0, total: 0 });

  // Carregar as questões e as respostas salvas
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/questoes/${caderno}`)
      .then((response) => {
        setQuestoes(response.data);
        setContador((prev) => ({ ...prev, total: response.data.length }));
      })
      .catch((error) => {
        console.error("Erro ao carregar as questões:", error);
      });

    axios
      .get(`${baseUrl}/api/respostas/${userId}/${caderno}`)
      .then((response) => {
        const respostasSalvas = response.data.reduce((acc, resposta) => {
          acc[resposta.questao_id] = {
            selecionada: resposta.alternativa_marcada,
            correta: resposta.is_correct,
          };
          return acc;
        }, {});
        setRespostas(respostasSalvas);

        const corretasCount = response.data.filter((r) => r.is_correct).length;
        setContador((prev) => ({ ...prev, corretas: corretasCount }));
      })
      .catch((error) => {
        console.error("Erro ao carregar respostas salvas:", error);
      });
  }, [caderno, userId]);

  const handleResposta = (questaoId, opcao) => {
    const questao = questoes.find((q) => q.questao_id === questaoId);
    const respostaAtual = respostas[questaoId];

    if (respostaAtual?.selecionada === opcao) {
      const novasRespostas = { ...respostas };
      delete novasRespostas[questaoId];
      setRespostas(novasRespostas);

      if (respostaAtual.correta) {
        setContador((prev) => ({ ...prev, corretas: prev.corretas - 1 }));
      }
    } else {
      const correta = questao.resposta_correta === opcao;
      setRespostas({
        ...respostas,
        [questaoId]: { selecionada: opcao, correta },
      });

      if (correta && (!respostaAtual || !respostaAtual.correta)) {
        setContador((prev) => ({ ...prev, corretas: prev.corretas + 1 }));
      } else if (!correta && respostaAtual?.correta) {
        setContador((prev) => ({ ...prev, corretas: prev.corretas - 1 }));
      }
    }
  };

  const handleSalvarRespostas = () => {
    const questoesSemResposta = questoes.filter(
      (questao) => !respostas[questao.questao_id]
    );

    if (questoesSemResposta.length > 0) {
      alert("Por favor, responda todas as questões antes de salvar.");
      const primeiraQuestaoSemRespostaId = questoesSemResposta[0].questao_id;
      questoesRefs.current[primeiraQuestaoSemRespostaId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const respostasArray = Object.entries(respostas).map(
      ([questaoId, resposta]) => ({
        user_id: userId,
        questao_id: parseInt(questaoId),
        caderno_id: caderno,
        is_correct: resposta.correta,
        alternativa_marcada: resposta.selecionada,
      })
    );

    axios
      .post(`${baseUrl}/api/respostas`, respostasArray)
      .then(() => {
        alert("Respostas salvas com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar respostas:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen overflow-auto bg-gray-900 pt-6 pb-16">
      <div
        className="w-full max-w-3xl bg-gradient-to-r from-green-500 to-green-900 p-6 rounded-lg shadow-lg text-center mb-8 fixed"
        style={{
          boxShadow: "0px -18px 20px 20px #111827",
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="absolute top-[53px] left-6 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-600 transition-colors"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">{`Bem-vindo, ${name}`}</h1>
        <p className="text-lg text-gray-200 mb-1">
          Cor do caderno:{" "}
          <span style={{ color: cadernoCor }}>{cadernoCor}</span>
        </p>
        <p className="text-lg font-semibold text-gray-50">
          Questões:{" "}
          <span className="text-yellow-300">
            {contador.corretas}/{contador.total}
          </span>
        </p>
      </div>

      <div className="max-w-3xl space-y-4 mt-48">
        {questoes.map((questao) => (
          <div
            key={questao.questao_id}
            ref={(el) => (questoesRefs.current[questao.questao_id] = el)}
            className="flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-lg shadow-md"
          >
            <div className="flex gap-8 items-center w-full border-b border-gray-700 pb-4">
              <div className="text-lg font-semibold text-gray-100">
                Questão {questao.numero}
              </div>
              <div className="flex gap-3">
                {["A", "B", "C", "D", "E"].map((opcao) => {
                  const resposta = respostas[questao.questao_id];
                  const isCorreta =
                    resposta?.correta && resposta?.selecionada === opcao;
                  const isErrada =
                    resposta &&
                    !resposta.correta &&
                    resposta.selecionada === opcao;
                  const isAlternativaCorreta =
                    resposta &&
                    !resposta.correta &&
                    opcao === questao.resposta_correta;

                  return (
                    <button
                      key={opcao}
                      onClick={() => handleResposta(questao.questao_id, opcao)}
                      className={`w-14 h-14 flex items-center justify-center rounded-lg border text-center font-bold ${
                        isCorreta
                          ? "bg-green-500 text-white"
                          : isErrada
                          ? "bg-red-500 text-white"
                          : isAlternativaCorreta
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-black"
                      } hover:bg-opacity-80 transition-colors`}
                    >
                      {opcao}
                    </button>
                  );
                })}
              </div>
            </div>
            {respostas[questao.questao_id] && (
              <div className="mt-2 text-sm flex items-center gap-2">
                {respostas[questao.questao_id].correta ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={
                    respostas[questao.questao_id].correta
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {respostas[questao.questao_id].correta
                    ? "Resposta Correta"
                    : "Resposta Incorreta"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSalvarRespostas}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-md hover:bg-blue-700 transition-colors"
      >
        Salvar Respostas
      </button>
    </div>
  );
};

export default Questoes;
