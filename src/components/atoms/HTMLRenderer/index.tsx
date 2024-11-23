import React from 'react';
import DOMPurify from 'dompurify';

type Props = {
    htmlContent: string;
};

const HTMLRenderer: React.FC<Props> = ({ htmlContent }) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);

    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default HTMLRenderer;