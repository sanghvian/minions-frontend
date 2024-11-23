import axios from "axios";
import toast from "react-hot-toast";
import vcardStructureString, { baseInstructions } from "./prompts/vcardPeopleStructure";
import { v4 } from "uuid";


export const convertIntoVCardForm = async (infoString: string) => {
    // console.log('Converting into contact...', infoString);
    const toastId = toast.loading('Converting into contact...');
    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';

    // Set request headers
    const headers = {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    const content = `I am passing you all the following information containing contact details 1 personal, that I want to record in my contacts book using the vCard (Virtual Card) format for storing. For your context, here is EXACT the guidelines of the data as per the latest vCard format - """""""${vcardStructureString}"""""" Here is the audio transcript containing the information about the contact I want to store ${infoString}. Follow these instructions - ${baseInstructions}.`

    const body = {
        "model": "gpt-3.5-turbo-16k",
        "messages": [{ "role": "user", "content": content }]
    }

    try {
        // Make the API call
        const response = await axios.post(url, body, { headers });
        // console.log('Success in generating Contact Card:', response);
        toast.success('Contact Generated!', { id: toastId })
        return response.data.choices[0].message.content;
    } catch (error) {
        // console.log('Error:', error);
        toast.error(`Unable to generate contact due to error - ${error}`, { id: toastId })
    }
}

export const sanitizeVCard = (text: string): string => {
    const validFields: string[] = [
        "ADR", "AGENT", "ANNIVERSARY", "BDAY", "BEGIN", "CALADRURI", "CALURI",
        "CATEGORIES", "CLASS", "CLIENTPIDMAP", "EMAIL", "END", "FBURL", "FN",
        "GENDER", "GEO", "IMPP", "KEY", "KIND", "LABEL", "LANG", "LOGO",
        "MAILER", "MEMBER", "N", "NAME", "NICKNAME", "NOTE", "ORG", "PHOTO",
        "PRODID", "PROFILE", "RELATED", "REV", "ROLE", "SORT-STRING", "SOUND",
        "SOURCE", "TEL", "TITLE", "TZ", "UID", "URL", "VERSION", "XML"
    ];

    const lines: string[] = text.split('\n');
    let sanitizedLines: string[] = [];

    for (const line of lines) {
        const field: string = line.split(':')[0].split(';')[0];
        if (validFields.includes(field)) {
            sanitizedLines.push(line);
        }
    }

    return sanitizedLines.join('\n');
}


export const downloadVCard = (cardDetails: string) => {
    const blob = new Blob([cardDetails], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${v4()}.vcf`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
};

