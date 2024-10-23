import React, { useState, useEffect } from 'react';
import './Modal.css'; // Add custom styling if needed
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote, useBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "./styles.css";
import axios from 'axios';

const EditClauseModal = ({closeModal, isOpen, id, text, nome, versao, ambito, ordem}) => {

    const [test, setTest] = useState({
        type: "paragraph",
        content: text ? text : "" // Assuming the BlockNote editor accepts 'content' as plain text
      })
    const [blocks, setBlocks] = useState([]);
    const [initialContent, setInitialContent] = useState([{
        type: "paragraph",
        content: text ? text : "" // Assuming the BlockNote editor accepts 'content' as plain text
      }]);
      const editor = useCreateBlockNote({
        initialContent: [test]
      });



     useEffect(() => {
        editor.insertBlocks([{
        type: "paragraph",
        content: text ? text : ""
        }], editor.document[0], "after")
    }, [isOpen])

    const updateClauseText = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/updateClauseText', {id: id, texto: JSON.stringify(blocks, null, 0)}); // This calls your Node.js server
            closeModal()
        } catch (error) {
            console.error('Error fetching clauses:', error);
        }
    };

    return (
    <>
        {isOpen && (
        <div className="modal-overlay">
        <div className="modal-content">
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
        </div>
        <button onClick={updateClauseText}>Update Clause Geral Text</button>
            <button className="close-button" onClick={closeModal}>
        Close
            </button>
        </div>
        </div>
        )}
    </>
    );
};

export default EditClauseModal;
