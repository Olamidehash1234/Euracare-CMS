import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import CustomDropdown from '../commonComponents/CustomDropdown';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const fontSizeOptions = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '24px', value: '24px' },
  { label: '30px', value: '30px' },
];

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Use TextStyle without invalid options (configure types is not supported in this version)
      TextStyle,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-base',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <div className="border-[0.5px] rounded-md border-[#01010133]">
      <div className="flex flex-wrap gap-2 p-2 border-b border-[#01010133] bg-gray-50">

        <CustomDropdown
          options={fontSizeOptions}
          value=""
          // apply font-size via textStyle mark (cast to any to avoid typings mismatch)
          onChange={(value) => (editor as any).chain().focus().setMark('textStyle', { fontSize: value }).run()}
          placeholder="Font Size"
          className="w-32"
        />

        {/* Text alignment buttons */}
        <div className="flex gap-1 border-l border-gray-200 pl-2">
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('left').run())}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
            title="Align Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('center').run())}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
            title="Align Center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('right').run())}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
            title="Align Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('justify').run())}
            className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200' : ''}`}
            title="Justify"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        {/* Existing formatting buttons */}
        <div className="flex gap-1 border-l border-gray-200 pl-2">
          <button
            type="button" // Explicitly set type to prevent form submission
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>
          </button>

          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
          </button>

          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
            className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            title="Heading"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M15 12h7"/></svg>
          </button>

          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" x2="21" y1="6" y2="6"/><line x1="9" x2="21" y1="12" y2="12"/><line x1="9" x2="21" y1="18" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>
          </button>
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        onClick={() => editor?.chain().focus().run()}
        className="p-3 min-h-[200px] focus:outline-none text-base leading-relaxed cursor-text" 
      />
    </div>
  );
};

export default TiptapEditor;
