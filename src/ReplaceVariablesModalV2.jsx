import React, { useMemo, useState } from "react";
import Modal from "react-modal";
import GenerateWordTest from "./GenerateWordTest";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import "./Modal.css"; // Custom CSS for modal styling

// Mock data
const clausesMock = [
  {
    id: 1,
    nome: "Cláusula Preliminar",
    tipo: "aceite",
    versao: "proporcional",
    ambito: "geral",
    texto:
      "Entre a <*Cedente*>, com sede no <*Morada da Cedente*>, na qualidade de <*Cedente*>, e <*Reinsurer*>, com sede em <*Morada*>, <*Local*>, na qualidade de <*Ressegurador*>, é estabelecido o presente Tratado de Resseguro (o “Tratado”), nos termos e condições constantes das Cláusulas seguintes:",
  },
  {
    id: 2,
    nome: "Cláusula Segunda",
    tipo: "aceite",
    versao: "proporcional",
    ambito: "geral",
    texto: "Negócio com <*Primeira Empresa*> e também com <*Segunda Empresa*>",
  },
];

// Regular expression to match placeholders like <*text*>
const placeholderRegex = /<([^<>]+)>/g;
Modal.setAppElement('#root');
const ClauseEditor = ({clauses = clausesMock}) => {  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [editedClauses, setEditedClauses] = useState(clauses);


    
  const placeholdersByClause = useMemo(() => {
    return editedClauses.map((clause) => {
      const matches = [...clause.texto.matchAll(placeholderRegex)];
      const placeholders = [...new Set(matches.map((match) => match[1]))];
      return { clauseId: clause.id, nome: clause.nome, placeholders };
    });
  }, [editedClauses]);

  // Open modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Handle input change
  const handleChange = (event, placeholder) => {
    setInputValues({
      ...inputValues,
      [placeholder]: event.target.value,
    });
  };

  const generateDocument = (updatedClauses) => {
    if (updatedClauses && Array.isArray(updatedClauses)) {
      console.log(updatedClauses);
      
      const paragraphs = updatedClauses.map((item) => [
        new Paragraph({
          children: [new TextRun({ text: item.nome || 'No name available', bold: true })],
        }),
        new Paragraph(item.texto || 'No text available')
      ]).flat();

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      Packer.toBlob(doc)
        .then((blob) => saveAs(blob, "generated-contract.docx"))
        .catch((error) => console.error("Error generating document:", error));
    } else {
      console.error("Invalid or empty clauses array");
    }
  };
// Replace placeholders in clause text
const replacePlaceholders = (text) => {
  console.log("Original text:", text); // Debugging
  console.log("Input values:", inputValues); // Debugging

  const replacedText = text.replace(placeholderRegex, (match, p1) => {
    const replacement = inputValues[p1];
    console.log(`Replacing placeholder <${p1}> with: ${replacement || match}`); // Debugging
    return replacement || match; // Use match if no replacement is found
  });

  console.log("Replaced text:", replacedText); // Debugging
  return replacedText;
};

  const applyReplacements = () => {
  const updatedClauses = editedClauses.map((clause) => ({
    ...clause,
    texto: replacePlaceholders(clause.texto),
  }));
  console.log(updatedClauses)
  setEditedClauses(updatedClauses);
  return updatedClauses; // Return the updated clauses
};

const generateWord = () => {
  const updatedClauses = applyReplacements(); // Get updated clauses
  console.log(updatedClauses)

  generateDocument(updatedClauses); // Pass them directly
  closeModal();
};

  return (
    <div>
      <button onClick={openModal}>Edit Clauses</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Edit Placeholders</h2>
        {placeholdersByClause.map(({ clauseId, nome, placeholders }) => (
          <div key={clauseId}>
            <h3>{nome}</h3>
            {placeholders.map((placeholder) => (
              <div key={placeholder}>
                <label>
                  {placeholder}:
                  <input
                    type="text"
                    value={inputValues[placeholder] || ""}
                    onChange={(e) => handleChange(e, placeholder)}
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={applyReplacements}>Apply Changes</button>
        <button onClick={generateWord}>Generate Word Document</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
      <div>
        <h3>Clauses</h3>
        {editedClauses && editedClauses.map((clause) => (
          <div key={clause.id}>
            <h4>{clause.nome}</h4>
            <p>{clause.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClauseEditor;
