const chunker = (text,chunkSize,overlap) => {
    if(text.length<chunkSize)
        return [text];
    const chunks = [];
    for(let i = 0; i<text.length; i += (chunkSize - overlap))
    {
        const chunk = text.substring(i,i+chunkSize);

        chunks.push(chunk);
    }

    return [chunks];
}

export default chunker;