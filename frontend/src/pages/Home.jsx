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
          alert("Erro ao salvar o usuário. Tente novamente.");
        });
    } else {
      alert("Por favor, insira seu nome e selecione uma cor de caderno.");
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
      .then((response) => {
        setUsuarios(
          usuarios.filter((usuario) => usuario.user_id !== usuarioId)
        );
        console.log(response);
      })
      .catch((error) => {
        console.error("Erro ao deletar o usuário:", error);
        alert("Erro ao deletar o usuário. Tente novamente.", error);
      });
  };

  // Função para alternar a visibilidade da tabela
  const toggleUsuarios = () => {
    setShowUsuarios(!showUsuarios);
  };

  return (
    <div className="flex flex-col items-center h-screen overflow-scroll bg-gray-900 text-white p-40">
      <h1 className="text-3xl font-bold mb-8 text-green-500">
        Bem-vindo ao Simulado do ENEM
      </h1>

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

      <button
        onClick={handleCadastrarQuestoes}
        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg w-72 shadow-md flex items-center justify-center space-x-2"
      >
        <PencilSquareIcon className="h-5 w-5" />
        <span>Alterar Questões</span>
      </button>

      {/* Botão para mostrar/ocultar lista de usuários */}
      <button
        onClick={toggleUsuarios}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-3 w-72 shadow-md flex items-center justify-center space-x-2"
      >
        <EyeIcon className="h-5 w-5" />

        <span>Ver Lista de Usuários</span>
      </button>

      {/* Tabela de usuários */}
      {showUsuarios && (
        <div className="mt-10 w-full max-w-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-6 text-green-400">
              Usuários Cadastrados
            </h2>
            <button
              onClick={toggleUsuarios}
              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
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
      )}
    </div>
  );
};

export default Home;
