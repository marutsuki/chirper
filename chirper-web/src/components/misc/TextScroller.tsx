import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FC } from "react";
import { useEffect, useState } from "react";
import { FaTerminal } from "react-icons/fa";

type TextScrollerProps = {
    texts: string[];
};

const TextScroller: FC<TextScrollerProps> = ({ texts }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        const handleTyping = () => {
            const currentText = texts[currentTextIndex];
            if (isDeleting) {
                if (charIndex > 0) {
                    setDisplayedText(currentText.substring(0, charIndex - 1));
                    setCharIndex(charIndex - 1);
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex((currentTextIndex + 1) % texts.length);
                }
            } else {
                if (charIndex < currentText.length) {
                    setDisplayedText(currentText.substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                } else {
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            }
        };

        const typingInterval = setInterval(handleTyping, 50);
        return () => clearInterval(typingInterval);
    }, [charIndex, isDeleting, texts, currentTextIndex]);

    return (
        <Alert>
            <AlertTitle className="flex items-center gap-2">
                <FaTerminal />
                Heads up!
            </AlertTitle>
            <AlertDescription className="font-heading min-h-10 text-wrap w-56 lg:w-full">
                {displayedText}
            </AlertDescription>
        </Alert>
    );
};

export default TextScroller;
