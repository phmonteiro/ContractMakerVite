import { useState } from 'react';
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun, UnderlineType } from "docx";
import * as docx from "docx";
import { saveAs } from "file-saver";
import "./Modal.css"; // Custom CSS for modal styling

const GenerateWord = ({ clauses }) => {
  const [isModalOpen, setModalOpen] = useState(false); 
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);


  const generateDocument = () => {

     if (clauses && Array.isArray(clauses)) {
      const paragraphs = [];

      clauses.forEach((item) => {
        // Title paragraph
        const title = new Paragraph({
          children: [
            new TextRun({
              text: item.nome || 'No name available',
              bold: true,
              size: 28, // adjust font size as needed
            }),
          ],
          alignment: "center",
        });
        paragraphs.push(title);

        // Body text with line breaks
        const textLines = item.texto.replace(/\\n/g, '\n').split('\n');
        textLines.forEach((line, index) => {
          const textRun = new TextRun({
            text: line,
            break: index !== textLines.length - 1, // Adds line break except for the last line
          });
          paragraphs.push(new Paragraph({ children: [textRun] }));
        });
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      Packer.toBlob(doc)
        .then((blob) => saveAs(blob, "generated-document.docx"))
        .catch((error) => console.error("Error generating document:", error));
    } else {
      console.error("Invalid or empty clauses array");
    }
  };


/*     if (clauses && Array.isArray(clauses)) {
    const paragraphs = clauses.map((item) => {
        [ new Paragraph({
            children: 
            [new TextRun({ text: item.nome || 'No name available', bold: true })],
            alignment: "center"
          }),
            new Paragraph(item.texto.replace(/\\n/g, '\n').split('\n').map((line) => [
              new TextRun({ text: line }),
              new TextRun({ break: 1 }),
            ]))
        ]}).flat();

      /*const paragraphs = clauses.map((item) => {
      [ new Paragraph({
          children: 
          [new TextRun({ text: item.nome || 'No name available', bold: true })],
          alignment: "center"
        }),
        new Paragraph({text: ''+item.texto || 'No text available', alignment: "center"})
      ]}).flat(); */
  
  return (
    <div>
      <button onClick={openModal}>Generate Word Document</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Generate Word Document</h2>
            <p>Click the button to generate a Word document with the clauses!</p>
            <button onClick={generateDocument}>Generate</button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default GenerateWord;
