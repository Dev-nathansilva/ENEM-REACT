import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UserPlusIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Ícones do Heroicons v2
import { PencilSquareIcon } from "@heroicons/react/24/solid";

const Home = () => {
  const baseUrl = "https://backend-enem-production.up.railway.app"; // URL base para o backend
  const [name, setName] = useState("");
  const [caderno, setCaderno] = useState("");
  const [cadernos, setCadernos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showUsuarios, setShowUsuarios] = useState(false); // Estado para controlar a visibilidade da tabela
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [sucessMessage, setSucessMessage] = useState("");

  // Carregar os cadernos do backend
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/cadernos`)
      .then((response) => {
        setCadernos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar os cadernos:", error);
      });
  }, []);

  // Carregar os usuários do backend
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/usuarios`)
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar os usuários:", error);
      });
  }, []);

  const handleProsseguir = () => {
    if (name && caderno) {
      const cadernoSelecionado = cadernos.find(
        (c) => c.caderno_id === parseInt(caderno)
      );

      // Envia os dados para o backend para salvar no banco de dados
      axios
        .post(`${baseUrl}/api/usuarios`, {
          name,
          caderno_id: caderno,
        })
        .then((response) => {
          navigate("/questoes", {
            state: {
              name,
              caderno,
              cadernoCor: cadernoSelecionado.cor,
              userId: response.data.user_id,
            },
          });
        })
        .catch((error) => {
          console.error("Erro ao salvar o usuário:", error);
          setErrorMessage("Erro ao salvar o usuário. Tente novamente.");
          setTimeout(() => {
            setErrorMessage("");
          }, 2000);
        });
    } else {
      setErrorMessage(
        "Por favor, insira seu nome e selecione uma cor de caderno."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  const handleCadastrarQuestoes = () => {
    navigate("/cadastro");
  };

  const handleVisualizarQuestoes = (nome, cadernoId, cadernoCor, usuarioId) => {
    navigate("/questoes", {
      state: { name: nome, caderno: cadernoId, cadernoCor, userId: usuarioId },
    });
  };

  const handleDeletarUsuario = (usuarioId) => {
    axios
      .delete(`${baseUrl}/api/usuarios/${usuarioId}`)
      .then(() => {
        setUsuarios(
          usuarios.filter((usuario) => usuario.user_id !== usuarioId)
        );
        setSucessMessage("usuário deletado com sucesso!");
        setTimeout(() => {
          setSucessMessage("");
        }, 1000);
      })
      .catch((error) => {
        console.error("Erro ao deletar o usuário:", error);
        setErrorMessage("Erro ao deletar o usuário. Tente novamente.");
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
      });
  };

  // Função para alternar a visibilidade da tabela
  const toggleUsuarios = () => {
    setShowUsuarios(!showUsuarios);
  };

  const closeErrorAlert = () => {
    setErrorMessage("");
  };
  const closeSucessAlert = () => {
    setSucessMessage("");
  };

  return (
    <div className="flex flex-col min-h-screen items-center overflow-auto bg-gray-900 text-white text-center pb-12 ">
      <div className="w-screen bg-slate-800 flex justify-center items-center min-h-20 gap-4 mb-6 bloco-superior">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="50"
          height="50"
          viewBox="0 0 48 48"
        >
          <path
            d="M 41.599609 2.1992188 C 40.399609 2.1992188 39.300391 2.6 38.400391 3.5 L 26.400391 15.5 C 26.100391 15.8 25.799219 16.199609 25.699219 16.599609 L 24.099609 22.199219 C 23.999609 22.699219 24.1 23.299219 24.5 23.699219 C 24.8 23.899219 25.199609 24.099609 25.599609 24.099609 C 25.699609 24.099609 25.9 24 26 24 L 31.599609 22.400391 C 31.999609 22.200391 32.399219 21.999219 32.699219 21.699219 L 44.699219 9.6992188 C 45.499219 8.7992187 46 7.7 46 6.5 C 46 5.3 45.500781 4.2 44.800781 3.5 C 43.900781 2.6 42.799609 2.1992188 41.599609 2.1992188 z M 10.5 7 C 6.9 7 4 9.9 4 13.5 L 4 30.5 C 4 34.1 6.9 37 10.5 37 L 12 37 L 12 42.5 C 12 43.5 12.500391 44.299219 13.400391 44.699219 C 13.800391 44.899219 14.1 45 14.5 45 C 15 45 15.6 44.8 16 44.5 L 26 37 L 37.5 37 C 41.1 37 44 34.1 44 30.5 L 44 13.5 L 44 13.199219 L 41 16.199219 L 41 30.5 C 41 32.4 39.4 34 37.5 34 L 25.5 34 C 25.2 34 24.899609 34.100781 24.599609 34.300781 L 15 41.5 L 15 35.5 C 15 34.7 14.3 34 13.5 34 L 10.5 34 C 8.6 34 7 32.4 7 30.5 L 7 13.5 C 7 11.6 8.6 10 10.5 10 L 28.800781 10 L 31.800781 7 L 10.5 7 z"
            fill="rgb(34,197,9)"
          ></path>
        </svg>
        <h1 className="title-main text-lg md:text-3xl font-bold text-green-500 ">
          Bem-vindo ao Simulado do ENEM
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-instruction text-center w-[350px] text-gray-500 mb-3">
          Cadastre-se, marque as alternativas da sua prova do ENEM 2024 e
          confira seu gabarito
        </p>

        <input
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg p-3 mb-4 w-72 shadow-md placeholder-gray-400 text-white"
        />

        <select
          value={caderno}
          onChange={(e) => setCaderno(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg p-3 mb-4 w-72 shadow-md text-white"
        >
          <option value="" className="text-gray-400">
            Selecione a cor do caderno
          </option>
          {cadernos.map((cadernoItem) => (
            <option key={cadernoItem.caderno_id} value={cadernoItem.caderno_id}>
              {cadernoItem.cor}
            </option>
          ))}
        </select>

        <button
          onClick={handleProsseguir}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-3 w-72 shadow-md flex items-center justify-center space-x-2"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Criar Novo Usuário</span>
        </button>
      </div>

      <div className="border border-gray-600 p-5 mt-10">
        <div className="flex mb-6 items-center justify-center gap-3 border-b-2 pb-2 border-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="27"
            height="27"
            viewBox="0 0 32 32"
          >
            <path
              fill="#fff"
              d="M 13.1875 3 L 13.03125 3.8125 L 12.4375 6.78125 C 11.484375 7.15625 10.625 7.683594 9.84375 8.3125 L 6.9375 7.3125 L 6.15625 7.0625 L 5.75 7.78125 L 3.75 11.21875 L 3.34375 11.9375 L 3.9375 12.46875 L 6.1875 14.4375 C 6.105469 14.949219 6 15.460938 6 16 C 6 16.539063 6.105469 17.050781 6.1875 17.5625 L 3.9375 19.53125 L 3.34375 20.0625 L 3.75 20.78125 L 5.75 24.21875 L 6.15625 24.9375 L 6.9375 24.6875 L 9.84375 23.6875 C 10.625 24.316406 11.484375 24.84375 12.4375 25.21875 L 13.03125 28.1875 L 13.1875 29 L 18.8125 29 L 18.96875 28.1875 L 19.5625 25.21875 C 20.515625 24.84375 21.375 24.316406 22.15625 23.6875 L 25.0625 24.6875 L 25.84375 24.9375 L 26.25 24.21875 L 28.25 20.78125 L 28.65625 20.0625 L 28.0625 19.53125 L 25.8125 17.5625 C 25.894531 17.050781 26 16.539063 26 16 C 26 15.460938 25.894531 14.949219 25.8125 14.4375 L 28.0625 12.46875 L 28.65625 11.9375 L 28.25 11.21875 L 26.25 7.78125 L 25.84375 7.0625 L 25.0625 7.3125 L 22.15625 8.3125 C 21.375 7.683594 20.515625 7.15625 19.5625 6.78125 L 18.96875 3.8125 L 18.8125 3 Z M 14.8125 5 L 17.1875 5 L 17.6875 7.59375 L 17.8125 8.1875 L 18.375 8.375 C 19.511719 8.730469 20.542969 9.332031 21.40625 10.125 L 21.84375 10.53125 L 22.40625 10.34375 L 24.9375 9.46875 L 26.125 11.5 L 24.125 13.28125 L 23.65625 13.65625 L 23.8125 14.25 C 23.941406 14.820313 24 15.402344 24 16 C 24 16.597656 23.941406 17.179688 23.8125 17.75 L 23.6875 18.34375 L 24.125 18.71875 L 26.125 20.5 L 24.9375 22.53125 L 22.40625 21.65625 L 21.84375 21.46875 L 21.40625 21.875 C 20.542969 22.667969 19.511719 23.269531 18.375 23.625 L 17.8125 23.8125 L 17.6875 24.40625 L 17.1875 27 L 14.8125 27 L 14.3125 24.40625 L 14.1875 23.8125 L 13.625 23.625 C 12.488281 23.269531 11.457031 22.667969 10.59375 21.875 L 10.15625 21.46875 L 9.59375 21.65625 L 7.0625 22.53125 L 5.875 20.5 L 7.875 18.71875 L 8.34375 18.34375 L 8.1875 17.75 C 8.058594 17.179688 8 16.597656 8 16 C 8 15.402344 8.058594 14.820313 8.1875 14.25 L 8.34375 13.65625 L 7.875 13.28125 L 5.875 11.5 L 7.0625 9.46875 L 9.59375 10.34375 L 10.15625 10.53125 L 10.59375 10.125 C 11.457031 9.332031 12.488281 8.730469 13.625 8.375 L 14.1875 8.1875 L 14.3125 7.59375 Z M 16 11 C 13.25 11 11 13.25 11 16 C 11 18.75 13.25 21 16 21 C 18.75 21 21 18.75 21 16 C 21 13.25 18.75 11 16 11 Z M 16 13 C 17.667969 13 19 14.332031 19 16 C 19 17.667969 17.667969 19 16 19 C 14.332031 19 13 17.667969 13 16 C 13 14.332031 14.332031 13 16 13 Z"
            ></path>
          </svg>
          <h3 className="">Funcionalidades</h3>
        </div>
        <button
          onClick={handleCadastrarQuestoes}
          className=" bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg w-72 shadow-md flex items-center justify-center space-x-2"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span>Alterar Questões</span>
        </button>

        {/* Botão para mostrar/ocultar lista de usuários */}
        <button
          onClick={toggleUsuarios}
          className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3 w-72 shadow-md flex items-center justify-center space-x-2"
        >
          <EyeIcon className="h-5 w-5" />

          <span>Ver Lista de Usuários</span>
        </button>
      </div>
      {/* Tabela de usuários */}
      {showUsuarios && (
        <div
          className="absolute p-10 border bg-slate-900 mt-20 w-full max-w-3xl max-h-[80vh] "
          style={{ boxShadow: "1px 1px 1px 1000px #00000066" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-green-400">
              Usuários Cadastrados
            </h2>
            <button
              onClick={toggleUsuarios}
              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full border border-gray-700 rounded-lg shadow-lg text-center">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="border-b border-gray-700 px-4 py-2">ID</th>
                  <th className="border-b border-gray-700 px-4 py-2">Nome</th>
                  <th className="border-b border-gray-700 px-4 py-2">
                    Cor do Caderno
                  </th>
                  <th className="border-b border-gray-700 px-4 py-2">Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.user_id} className="hover:bg-gray-900">
                    <td className="border-b border-gray-700 px-4 py-2">
                      {usuario.user_id}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2">
                      {usuario.name}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2">
                      {usuario.caderno_cor}
                    </td>
                    <td className="border-b border-gray-700 px-4 py-2 flex justify-center space-x-2">
                      <button
                        onClick={() =>
                          handleVisualizarQuestoes(
                            usuario.name,
                            usuario.caderno_id,
                            usuario.caderno_cor,
                            usuario.user_id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center space-x-1"
                      >
                        <EyeIcon className="h-5 w-5" />
                        <span>Ver Questões</span>
                      </button>
                      <button
                        onClick={() => handleDeletarUsuario(usuario.user_id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center space-x-1"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Deletar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <img
        src="images/nathan-logo.svg"
        alt="logo do nathan"
        className="fixed bottom-4 right-4"
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

export default Home;
