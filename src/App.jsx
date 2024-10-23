import { useState, useEffect } from 'react';
import axios from 'axios';
import ClausesList from './ClausesList';
import './App.css';
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "./styles.css";
import EditClauseModal from './EditClauseModal';
import { BlockNoteTest } from "./BlockNoteTest";

function App() {
  /*let clausulas = [
    {
      "id": 1,
      "texto": "Entre  a <Cedente>, com sede no <Morada da Cedente>, na qualidade de <Cedente>, e <Reinsurer>, com sede em <Morada>, <Local>, na qualidade de <Ressegurador>, é estabelecido o presente Tratado de Resseguro (o “Tratado”), nos termos e condições constantes das Cláusulas seguintes:",
      "tipo": "aceite",
      "ramo": "incêndio",
      "ordem": 0,
      "nome": "Cláusula Preliminar",
      "versao": "p",
      "ambito": "Geral"
    },
    {
      "id": 2,
      "texto": " O presente Tratado tem por objeto os contratos de seguro, subscritos pela Cedente ou por ela aceites em resseguro facultativo, (os “Negócios”) relativos aos Ramos Incêndio e Riscos Acessórios, Multirriscos (Habitação, Comercial e Industrial), Perdas de Exploração e Furto ou Roubo. ",
      "tipo": "aceite",
      "ramo": "incêndio",
      "ordem": 1,
      "nome": "Objecto do Tratado",
      "versao": "p",
      "ambito": "Geral"
    },
    {
      "id": 3,
      "texto": " Não são abrangidos pelo presente Tratado:\r\n-\tSeguros ou resseguros aceites ao abrigo de Tratados de resseguro obrigatório ou de retrocessão;\r\n-\tSeguros ou resseguros aceites em regime de excedente de sinistros;\r\n-\tRiscos de guerra e guerra civil;\r\n-\tRiscos atómicos e nucleares;\r\n-\tResponsabilidades de qualquer espécie resultantes da delegação de poderes de subscrição a terceiros;\r\n-\tPagamentos ex-gratia;\r\n-\tApólices em 1º risco;\r\n-\tTodos os riscos especificamente excluídos nos Anexos",
      "tipo": "aceite",
      "ramo": "incêndio",
      "ordem": 2,
      "nome": "Exclusões",
      "versao": "p",
      "ambito": "Geral"
    }
]*/
  const [clauses, setClauses] = useState([]);
  const [filters, setFilters] = useState({
    nome: '',
    tipo: '',
    versao: '',
    ambito: ''
  });
  const [isOpen, setIsOpen] = useState(false)
  const [blocks, setBlocks] = useState([]);
  const editor = useCreateBlockNote({

  });
  
/*     initialContent: [
  {
    type: "paragraph",
    content: "Cláusula Preliminar Entre  a <*Cedente*>, com sede no <*Morada da Cedente*>, na qualidade de <*Cedente*>, e <*Reinsurer*>, com sede em <*Morada*>, <*Local*>, na qualidade de <*Ressegurador*>, é estabelecido o presente Tratado de Resseguro (o “Tratado”), nos termos e condições constantes das Cláusulas seguintes:",
  }
],*/
  useEffect(() => {
    const fetchClauses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clauses'); // This calls your Node.js server
        setClauses(response.data);
      } catch (error) {
        console.error('Error fetching clauses:', error);
      }
    };
    fetchClauses();
  }, []);
  

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClausesFiltering = (e) => {
    setClauses(e.target.value)
  }

  const handleIsOpen = (e) => {
    setIsOpen(!isOpen)
  }

  const onClose = (e) => {
    setIsOpen(!isOpen)
  }
  
  return (
    <div>
      <div>
        <BlockNoteTest />
      </div>
      {false && 
      <div className={"wrapper"}>
      <div>BlockNote Editor:</div>
      <div className={"item"}>
        <BlockNoteView
          editor={editor}
          onChange={() => {
            // Saves the document JSON to state.
            setBlocks(editor.document);
          }}
        />
      </div>
      <div>Document JSON:</div>
      <div className={"item bordered"}>
        <pre>
          <code>{JSON.stringify(blocks, null, 1)}</code>
        </pre>
      </div>
      {/*<button onClick={updateClauseText}>Update Clause Geral Text</button>*/}
    </div>} 
      <h3 style={{ color: 'red'}}>Contract Maker by Tech Hub</h3>
      <div>     
        Tipo de Contrato
        <p>
          <select
            name="ambito"
            id="ambito"
            value={filters.ambito}
            onChange={handleFilterChange}
          >
            <option value="">Selecione o tipo de contrato
            </option>
            <option value="Particular">Particular</option>
            <option value="Geral">Geral</option>
          </select>
        </p>
      </div>
      <div>
        <input
          name="nome"
          placeholder="Filter by Nome"
          value={filters.nome}
          onChange={handleFilterChange}
        />
        <input
          name="tipo"
          placeholder="Filter by Tipo"
          value={filters.tipo}
          onChange={handleFilterChange}
        />
        <input
          name="versao"
          placeholder="Filter by Versao"
          value={filters.versao}
          onChange={handleFilterChange}
        />
      </div>
      
      <ClausesList contractClauses={clauses}
      contractFilters={filters} handleClausesFiltering={handleClausesFiltering}/>
    </div>

    
  );

  

}

export default App
