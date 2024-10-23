import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
// import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { useMemo, useState } from "react";
import demoData from "./demoData.json";
import { BlockNoteEditor } from "@blocknote/core";

export const BlockNoteTest = () => {

  const [initialContent, setInitialContent] = useState(demoData);
    
    const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }

    return BlockNoteEditor.create({initialContent})
  }, [initialContent]);

  return (
    <div className="blocknotemain">
      <BlockNoteView editor={editor} />
      <p>Teste</p>
    </div>
  );
};
