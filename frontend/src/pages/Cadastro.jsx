import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeftIcon, XMarkIcon } from "@heroicons/react/24/solid"; // Versão 2

const Cadastro = () => {
  const baseUrl = "https://backend-enem-production.up.railway.app"; // URL base para o backend
  const [cadernos, setCadernos] = useState([]);
  const [cadernoSelecionado, setCadernoSelecionado] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [novaQuestao, setNovaQuestao] = useState({ numero: "", letra: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  // Carregar os cadernos ao montar o componente
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/cadernos`)
      .then((response) => setCadernos(response.data))
      .catch((error) => console.error("Erro ao carregar cadernos:", error));
  }, []);

  // Carregar questões do caderno selecionado
  useEffect(() => {
    if (cadernoSelecionado) {
      axios
        .get(`${baseUrl}/api/questoes/${cadernoSelecionado}`)
        .then((response) => setQuestoes(response.data))
        .catch((error) => console.error("Erro ao carregar questões:", error));
    } else {
      setQuestoes([]);
    }
  }, [cadernoSelecionado]);

  const handleAdicionarQuestao = () => {
    if (!cadernoSelecionado) {
      setErrorMessage(
        "Por favor, selecione um caderno antes de adicionar uma questão."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }
    const { numero, letra } = novaQuestao;

    // Verificação dos campos 'numero' e 'letra'
    if (!numero || !letra) {
      setErrorMessage(
        "Por favor, preencha os campos 'Número' e 'Letra' antes de adicionar a questão."
      );
      setTimeout(() => setErrorMessage(""), 2000); // Limpa a mensagem de erro após 2 segundos
      return;
    }

    axios
      .post(`${baseUrl}/api/questoes/adicionar-questao`, {
        caderno_id: cadernoSelecionado,
        numero,
        letra,
      })
      .then(() => {
        setNovaQuestao({ numero: "", letra: "" });
        return axios.get(`${baseUrl}/api/questoes/${cadernoSelecionado}`);
      })
      .then((response) => setQuestoes(response.data))
      .catch((error) => console.error("Erro ao adicionar questão:", error));
  };

  const handleDeletarQuestao = (questaoId) => {
    axios
      .delete(`${baseUrl}/api/questoes/deletar-questao/${questaoId}`)
      .then(() => {
        setQuestoes(questoes.filter((q) => q.questao_id !== questaoId));
        setSucessMessage("questão deletada com sucesso!");
        setTimeout(() => {
          setSucessMessage("");
        }, 1000);
      })
      .catch((error) => console.error("Erro ao deletar questão:", error));
  };

  const handleAtualizarQuestao = (questaoId, numero, letra) => {
    axios
      .put(`${baseUrl}/api/questoes/atualizar-questao/${questaoId}`, {
        numero,
        letra,
      })
      .then(() => {
        setQuestoes((prevQuestoes) =>
          prevQuestoes.map((q) =>
            q.questao_id === questaoId
              ? { ...q, numero, resposta_correta: letra }
              : q
          )
        );
        setSucessMessage("atualizada questão com sucesso!");
        setTimeout(() => {
          setSucessMessage("");
        }, 1000);
      })
      .catch((error) => console.error("Erro ao atualizar questão:", error));
  };

  const closeErrorAlert = () => {
    setErrorMessage("");
  };
  const closeSucessAlert = () => {
    setSucessMessage("");
  };

  return (
    <div className="w-screen min-h-screen overflow-auto bg-gray-900 text-gray-200 pb-14">
      {/* max-w-4xl mx-auto */}

      <div className="w-screen bg-slate-800 flex justify-center items-center min-h-20 gap-4 mb-6">
        {/* Botão Voltar */}
        <div className="absolute left-6">
          <a
            href="/"
            className="text-gray-400 hover:text-gray-200 flex items-center"
          >
            <ChevronLeftIcon className="w-6 h-6 mr-2" />
            <span className="hidden md:block">Voltar</span>
          </a>
        </div>

        <h1 className="text-lg md:text-3xl font-semibold text-center ">
          Cadastrar e Alterar de Questões
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-5">
        <div className="bloco-1">
          {/* Selecionar Caderno */}
          <div className="mb-6">
            <label
              htmlFor="caderno"
              className="block text-lg font-medium text-gray-300"
            >
              Selecionar Caderno:
            </label>
            <select
              id="caderno"
              onChange={(e) => setCadernoSelecionado(e.target.value)}
              className="w-full p-3 mt-2 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Escolha um caderno</option>
              {cadernos.map((caderno) => (
                <option key={caderno.caderno_id} value={caderno.caderno_id}>
                  {caderno.cor}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Questões */}
          <div className="mb-6">
            {questoes.length > 0 ? (
              <ul className="space-y-4">
                {questoes.map((questao) => (
                  <li
                    key={questao.questao_id}
                    className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-lg">
                        Questão {questao.numero} - Resposta Correta:{" "}
                        {questao.resposta_correta}
                      </div>
                      <button
                        onClick={() => handleDeletarQuestao(questao.questao_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Deletar
                      </button>
                    </div>

                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Número"
                        value={questao.numero}
                        onChange={(e) =>
                          handleAtualizarQuestao(
                            questao.questao_id,
                            e.target.value,
                            questao.resposta_correta
                          )
                        }
                        className="w-full p-2 mt-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={questao.resposta_correta}
                        onChange={(e) =>
                          handleAtualizarQuestao(
                            questao.questao_id,
                            questao.numero,
                            e.target.value
                          )
                        }
                        className="w-full p-2 mt-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {["A", "B", "C", "D", "E"].map((opcao) => (
                          <option key={opcao} value={opcao}>
                            {opcao}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma questão cadastrada para este caderno.
              </p>
            )}
          </div>
        </div>
        {/* Adicionar Nova Questão */}
        <div className="bloco-2 border border-gray-600 p-6 bg-slate-900">
          <h2 className="text-xl font-semibold mb-4">Adicionar Nova Questão</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Número da Questão"
              value={novaQuestao.numero}
              onChange={(e) =>
                setNovaQuestao((prev) => ({
                  ...prev,
                  numero: e.target.value,
                }))
              }
              className="w-1/2 p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={novaQuestao.letra}
              onChange={(e) =>
                setNovaQuestao((prev) => ({ ...prev, letra: e.target.value }))
              }
              className="w-1/2 p-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Escolha a alternativa correta</option>
              {["A", "B", "C", "D", "E"].map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdicionarQuestao}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Adicionar Questão
          </button>
        </div>
      </div>

      <img
        src="images/nathan-logo.svg"
        alt="logo do nathan"
        className="fixed bottom-4 right-4 hidden md:block"
        width={"60px"}
        height={"60px"}
      />

      {/* Alerta de erro */}
      {errorMessage && (
        <div className="errorAlert">
          <span>{errorMessage}</span>
          <button onClick={closeErrorAlert} className="closeButton">
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
      {/* Alerta de sucesso */}
      {sucessMessage && (
        <div className="sucessAlert">
          <span>{sucessMessage}</span>
          <button onClick={closeSucessAlert} className="closeButton">
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Cadastro;
