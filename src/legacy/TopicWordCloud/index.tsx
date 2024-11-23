import React from 'react'
import ReactWordcloud from 'react-wordcloud';

interface WordCount {
    text: string;
    value: number;
}

function getWordCounts(combinedAnswerString: string): WordCount[] {
    const stopWords: string[] = [
        'the', 'and', 'a', 'to', 'of', 'in', 'i', 'it', 'for', 'with', 'not', 'on', 'he', 'as', 'you',
        'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an',
        'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
        'who', 'get', 'which', 'go', 'me', 'has', 'have', 'that', 'was', 'doing', 'are', 'were', 'be',
        'been', 'is', 'had', 'did', 'your', 'how', 'why', 'where', 'when', 'can', 'could', 'should',
        'would', 'might', 'must', 'shall', 'will', 'does', 'done', 'am', 'our', 'ours', 'your', 'yours',
        'him', 'his', 'her', 'hers', 'its', 'their', 'theirs', 'you', 'yours', 'our', 'ours', 'all',
        'any', 'each', 'few', 'many', 'most', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
        'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'd', 'll',
        'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven',
        'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn'
    ];  // Add or remove words as needed
    const words: string[] = combinedAnswerString
        .toLowerCase()
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ")
        .split(" ")
        .filter(word => !stopWords.includes(word) && word !== '');

    const wordCounts: Record<string, number> = words.reduce((acc: Record<string, number>, word: string) => {
        acc[word] = acc[word] ? acc[word] + 1 : 1;
        return acc;
    }, {});

    return Object.entries(wordCounts).map(([word, count]): WordCount => ({ text: word, value: count }));
}
const TopicWordCloud: React.FC<{ wordsString: string }> = ({ wordsString }) => {

    return (
        <div>
            <ReactWordcloud words={getWordCounts(wordsString)} />
        </div>
    )
}

export default TopicWordCloud
