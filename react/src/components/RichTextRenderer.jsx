import React from "react";

const RichTextRenderer = ({ htmlContent }) => {
    // Función para manejar estilos globales de HTML incrustado
    const getGlobalStyles = () => `
    .rich-text h1 { @apply text-2xl font-bold mb-4; }
    .rich-text h2 { @apply text-xl font-semibold mb-3; }
    .rich-text h3 { @apply text-lg font-medium mb-2; }
    .rich-text p { @apply mb-2; }
    .rich-text a { @apply text-blue-600 hover:underline; }
    .rich-text ul { @apply list-disc pl-5 mb-2; }
    .rich-text ol { @apply list-decimal pl-5 mb-2; }
    .rich-text strong { @apply font-bold; }
    .rich-text em { @apply italic; }
    .rich-text blockquote { @apply border-l-4 border-gray-300 pl-4 italic; }
  `;

    return (
        <>
            <style jsx global>
                {getGlobalStyles()}
            </style>
            <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </>
    );
};

export default RichTextRenderer;
