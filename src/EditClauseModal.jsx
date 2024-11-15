import React, { useState, useEffect, useMemo } from 'react';
import './Modal.css'; // Add custom styling if needed
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "./styles.css";
import axios from 'axios';
import * as Blocknote from '@blocknote/react';

const EditClauseModal = ({closeModal, isOpen, id, text, nome, versao, ambito, ordem}) => {

    const [blocks, setBlocks] = useState([]);
    const editor = useCreateBlockNote({
        initialContent: [{
            type: "paragraph",
            content: text // Assuming the BlockNote editor accepts 'content' as plain text
        }], 
    }, [text]);  
/*     const editor = useCreateBlockNote({
            initialContent: [{
                type: "paragraph",
                content: text // Assuming the BlockNote editor accepts 'content' as plain text
            }], 
        }, [text]);  
        
        //const editor = useCreateBlockNote({});
        //useMemo(() => {
        // text ? editor.replaceBlocks(editor.document, JSON.parse(text)) 
        //              : null, [text]}
    //  );
    useEffect(() => {
        // Ensure editor and text are initialized before replacing blocks
        if (editor && text) {
            editor.replaceBlocks(editor.document, JSON.parse(text)); // JSON.parse(text)
        }
    }, [editor, text]); */

    const blocksFromHTML = editor.blocksToFullHTML(blocks);

      const handleChange = (editor) => {
        setContent(editor.getJSON());
      }

    const updateClauseText = async () => {
        try {
            closeModal()
          const response = await axios.post('http://localhost:5000/api/updateClauseText', // {id: id, texto: JSON.stringify(blocks, null, 0)}); // This calls your Node.js server
            {id: id, texto: text})
            
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
                {<BlockNoteView
                    editor={editor}
                    onChange={() => {
                        // Saves the document JSON to state.
                        setBlocks(editor.document);
                    }}
                />}  
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
