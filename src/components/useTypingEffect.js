import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 150, setIsTypingFinished) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        setDisplayedText('');
        const interval = setInterval(() => {
            setDisplayedText(prev => prev + text.charAt(index));
            index++;
            if (index >= text.length) {
                clearInterval(interval);
                setIsTypingFinished(true);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed, setIsTypingFinished]);

    return displayedText;
};

export default useTypingEffect;
