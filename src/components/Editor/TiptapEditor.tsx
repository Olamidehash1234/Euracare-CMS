import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { useEffect, useRef, useState } from 'react';
import Toast from '../GlobalComponents/Toast';
import { uploadToCloudinary } from '../../services/cloudinaryService';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  mode?: 'default' | 'bulletOnly' | 'paragraphOnly';
}

const TiptapEditor = ({ content, onChange, mode = 'default' }: TiptapEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('loading');
  const extensions: any[] = [];
  
  // Configure extensions based on mode
  if (mode === 'paragraphOnly') {
    // In paragraphOnly mode, use minimal extensions - just paragraph handling
    extensions.push(StarterKit.configure({
      bold: false,
      italic: false,
      code: false,
      codeBlock: false,
      heading: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
      blockquote: false,
      horizontalRule: false,
      strike: false,
    }));
  } else {
    extensions.push(StarterKit);
    // Only add text style / align when in default mode
    if (mode === 'default') {
      extensions.push(TextStyle);
      extensions.push(
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
        })
      );
      // Add Image extension for default mode
      extensions.push(
        Image.configure({
          allowBase64: true,
          HTMLAttributes: {
            class: 'w-full h-auto object-cover rounded-md',
          },
        })
      );
      // Add Link extension for default mode
      extensions.push(
        Link.configure({
          openOnClick: true,
          autolink: true,
          linkOnPaste: true,
          HTMLAttributes: {
            class: 'text-blue-500 underline cursor-pointer hover:text-blue-700',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        })
      );
    }
  }

  const editor = useEditor({
    extensions,
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

  // Auto-enable bullet list on first focus in bulletOnly mode
  useEffect(() => {
    if (!editor || mode !== 'bulletOnly') return;

    const handleFocus = () => {
      // Enable bullet list if content is empty and not already enabled
      if (editor.isEmpty && !editor.isActive('bulletList')) {
        setTimeout(() => {
          editor.chain().focus().toggleBulletList().run();
        }, 0);
      }
    };

    editor.on('focus', handleFocus);
    return () => {
      editor.off('focus', handleFocus);
    };
  }, [editor, mode]);

  if (!editor) return null;

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploadingImage(true);
    setToastType('loading');
    setToastMessage('Uploading image...');
    setShowToast(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        console.log('📤 [TiptapEditor] Uploading image to Cloudinary:', file.name);
        
        // Upload to Cloudinary
        const response = await uploadToCloudinary(file, 'blog');
        
        console.log('✅ [TiptapEditor] Image uploaded successfully:', response.secure_url);
        
        // Insert the uploaded image URL into the editor
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs: {
              src: response.secure_url,
            },
          })
          .run();
      }

      // Show success message
      setToastType('success');
      setToastMessage('Image uploaded successfully!');
      setShowToast(true);
    } catch (error) {
      console.error('❌ [TiptapEditor] Image upload failed:', error);
      setToastType('error');
      setToastMessage(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowToast(true);
    } finally {
      setIsUploadingImage(false);

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle link insertion
  const handleAddLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) {
      console.log('🔗 [TiptapEditor] Adding link:', url);
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' })
        .run();
    }
  };

  // Hide toolbar in paragraphOnly and bulletOnly modes
  if (mode === 'paragraphOnly' || mode === 'bulletOnly') {
    return (
      <div className="border-[0.5px] rounded-md border-[#01010133]">
        <EditorContent 
          editor={editor} 
          onClick={() => editor?.chain().focus().run()}
          className="p-3 min-h-[200px] focus:outline-none text-base leading-relaxed cursor-text [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_h2]:text-[32px] [&_h2]:font-bold [&_h2]:my-4 [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:my-3 [&_img]:w-full [&_img]:h-[300px] [&_img]:object-cover [&_img]:rounded-md [&_img]:my-2" 
        />
        <Toast 
          message={toastMessage} 
          type={toastType} 
          show={showToast} 
          onHide={() => setShowToast(false)} 
        />
      </div>
    );
  }

  return (
    <div className="border-[0.5px] rounded-md border-[#01010133] relative">
      <div className="flex flex-wrap gap-2 p-2 border-b border-[#01010133] bg-gray-50 relative z-[10]">

        {/* Text alignment buttons (only in default mode) */}
        {mode === 'default' && (
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
        )}

        {/* Image and Link buttons (only in default mode) */}
        {mode === 'default' && (
          <div className="flex gap-1 border-l border-gray-200 pl-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!isUploadingImage) {
                  fileInputRef.current?.click();
                }
              }}
              disabled={isUploadingImage}
              className={`p-2 rounded hover:bg-gray-200 ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isUploadingImage ? 'Uploading...' : 'Insert Image'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </button>

            <button
              type="button"
              onClick={(e) => handleButtonClick(e, handleAddLink)}
              className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
              title="Add Link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              multiple
              disabled={isUploadingImage}
            />
          </div>
        )}

        {/* Existing formatting buttons (reduce to only bullet list in bulletOnly mode) */}
        <div className="flex gap-1 border-l border-gray-200 pl-2">
          {mode === 'default' && (
            <>
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
                title="Heading (32px)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M15 12h7"/></svg>
              </button>

              <button
                type="button"
                onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
                className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
                title="Sub-Heading (20px)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h7"/><path d="M4 19V5"/><path d="M11 19V5"/><path d="M14 12h7"/><path d="M17.5 19v-3.5a3.5 3.5 0 0 1 7 0V19"/></svg>
              </button>
            </>
          )}

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
        className="p-3 min-h-[200px] focus:outline-none text-base leading-relaxed cursor-text [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-0 [&_img]:w-full [&_img]:h-auto [&_img]:object-cover [&_img]:rounded-md [&_img]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_h2]:text-[32px] [&_h2]:font-bold [&_h2]:my-4 [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:my-3" 
      />
      
      <Toast 
        message={toastMessage} 
        type={toastType} 
        show={showToast} 
        onHide={() => setShowToast(false)} 
      />
    </div>
  );
};

export default TiptapEditor;
