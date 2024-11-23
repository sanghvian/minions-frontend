import React from 'react'

const DownloadVCard: React.FC<{ cardDetails: string }> = (props) => {
    const cardDetails = props.cardDetails;
    const downloadVCard = () => {
        const blob = new Blob([cardDetails], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'contact.vcf';

        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
    };

    return (
        <div>
            <button onClick={downloadVCard}>Download vCard</button>
        </div>
    );
}

export default DownloadVCard
