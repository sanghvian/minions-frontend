import { format } from 'date-fns'

export const sleep = async (ms: number) => {
    return await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


export const convertBrokenStringToFormattedMultilineString = (brokenString: string) => {
    // Remove <br> tags and replace them with a newline character
    const cleanedBio = brokenString?.replace(/<br>/g, '\n');

    // Split the biography into sentences based on the newline character
    const sentences = cleanedBio?.split('\n');

    // Filter out any empty strings that might result from the split
    return sentences
        .filter((sentence: string) => sentence.trim() !== '')
        ?.map((sentence: string) => {
            return sentence.trim() + '\n';
        })
}


export const formatDate = (dateString: string) => {
    // For the edge case where no endDate is provided since the job role is actually still there
    if (dateString === "Present") return 'Present';
    const [year, month] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return format(date, 'MMM yyyy');
}

export const toTitleCase = (str: string) => {
    return str ? str?.replace(
        /\w\S*/g,
        (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ) : "User";
};