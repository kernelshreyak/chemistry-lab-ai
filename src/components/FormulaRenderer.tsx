import React from 'react';

interface FormulaRendererProps {
    formula: string;
}

const FormulaRenderer: React.FC<FormulaRendererProps> = ({ formula }) => {
    // Parse chemical formula and add subscripts
    const renderFormula = (formula: string) => {
        const parts: React.ReactNode[] = [];
        let currentText = '';

        for (let i = 0; i < formula.length; i++) {
            const char = formula[i];

            // Check if it's a number
            if (/\d/.test(char)) {
                if (currentText) {
                    parts.push(<span key={`text-${i}`}>{currentText}</span>);
                    currentText = '';
                }
                parts.push(<sub key={`sub-${i}`}>{char}</sub>);
            } else {
                currentText += char;
            }
        }

        if (currentText) {
            parts.push(<span key="final">{currentText}</span>);
        }

        return parts;
    };

    return (
        <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.1em',
            fontWeight: 500,
            letterSpacing: '0.3px'
        }}>
            {renderFormula(formula)}
        </span>
    );
};

export default FormulaRenderer;
