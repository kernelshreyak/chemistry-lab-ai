import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from 'langchain/prompts';
import { ChemicalReaction, ChemicalCompound, ReactionScenario } from '../types/chemistry.js';

// Lazy initialization - only create LLM when actually needed
let llm: ChatOpenAI | null = null;

function getLLM(): ChatOpenAI {
    if (!llm) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-api-key-here') {
            throw new Error('Please set a valid OPENAI_API_KEY in server/.env file');
        }
        llm = new ChatOpenAI({
            modelName: 'gpt-4.1',
            temperature: 0.3,
            openAIApiKey: process.env.OPENAI_API_KEY,
        });
    }
    return llm;
}

const reactionPrompt = PromptTemplate.fromTemplate(`You are an expert chemist. Given a chemical reaction scenario, predict the reactants and products with detailed information.

Reaction Scenario: {scenario}
${`{conditions}`}

Provide the response in the following JSON format (strictly valid JSON only, no markdown):
{{
  "reactants": [
    {{
      "name": "common name",
      "iupacName": "IUPAC systematic name",
      "smiles": "SMILES notation",
      "formula": "molecular formula (e.g., H2O, CH4, CO2)",
      "molecularWeight": weight in g/mol
    }}
  ],
  "products": [
    {{
      "name": "common name",
      "iupacName": "IUPAC systematic name", 
      "smiles": "SMILES notation",
      "formula": "molecular formula",
      "molecularWeight": weight in g/mol
    }}
  ],
  "balancedEquation": "balanced chemical equation with proper stoichiometry"
}}

Be precise and chemically accurate. Include all major reactants and products.`);

export async function predictReaction(scenario: ReactionScenario): Promise<ChemicalReaction> {
    try {
        const conditionsText = [
            scenario.conditions ? `Conditions: ${scenario.conditions}` : '',
            scenario.temperature ? `Temperature: ${scenario.temperature}°C` : '',
            scenario.catalyst ? `Catalyst: ${scenario.catalyst}` : '',
        ]
            .filter(Boolean)
            .join('\n');

        const prompt = await reactionPrompt.format({
            scenario: scenario.description,
            conditions: conditionsText || 'Standard conditions',
        });

        const response = await getLLM().invoke(prompt);
        const content = response.content as string;

        // Extract JSON from potential markdown code blocks
        let jsonContent = content.trim();
        if (jsonContent.startsWith('```')) {
            const match = jsonContent.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
            jsonContent = match ? match[1] : jsonContent;
        }

        const parsed = JSON.parse(jsonContent);

        return {
            reactants: parsed.reactants || [],
            products: parsed.products || [],
            scenario,
            balancedEquation: parsed.balancedEquation || '',
        };
    } catch (error) {
        console.error('Error predicting reaction:', error);
        throw new Error('Failed to predict chemical reaction');
    }
}

// Generate 3D structure coordinates from SMILES (simplified - in production use RDKit or similar)
export async function generate3DStructure(smiles: string): Promise<string> {
    // For now, return the SMILES as the structure
    // In production, you would use RDKit or a chemistry API to convert SMILES to 3D coordinates
    // This could be enhanced with services like PubChem or ChemSpider
    return smiles;
}

export async function getCompoundDetails(smiles: string): Promise<ChemicalCompound | null> {
    try {
        const prompt = `Provide detailed information about the chemical compound with SMILES notation: ${smiles}

Return ONLY valid JSON in this exact format:
{{
  "name": "common name",
  "iupacName": "IUPAC name",
  "smiles": "${smiles}",
  "formula": "molecular formula",
  "molecularWeight": weight in g/mol
}}`;

        const response = await getLLM().invoke(prompt);
        const content = response.content as string;

        let jsonContent = content.trim();
        if (jsonContent.startsWith('```')) {
            const match = jsonContent.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
            jsonContent = match ? match[1] : jsonContent;
        }

        return JSON.parse(jsonContent);
    } catch (error) {
        console.error('Error getting compound details:', error);
        return null;
    }
}

export async function generateCompoundDescription(compound: {
    name: string;
    iupacName?: string;
    smiles: string;
    formula?: string
}): Promise<string> {
    try {
        const prompt = `Provide a comprehensive description of the chemical compound "${compound.name}" (${compound.iupacName || 'N/A'}).

Compound Information:
- Common Name: ${compound.name}
- IUPAC Name: ${compound.iupacName || 'N/A'}
- Molecular Formula: ${compound.formula || 'N/A'}
- SMILES: ${compound.smiles}

Please provide a detailed description covering:

**Physical Properties:**
- Appearance, state, color, odor
- Melting point, boiling point
- Density, solubility

**Chemical Properties:**
- Reactivity and stability
- pH characteristics
- Flammability and decomposition

**Storage Requirements:**
- Temperature and container requirements
- Safety precautions
- Shelf life considerations

**Applications and Uses:**
- Industrial applications
- Pharmaceutical uses
- Research applications
- Consumer products

Format as clear, professional text with sections. Be concise but informative.`;

        const response = await getLLM().invoke(prompt);
        return response.content as string;
    } catch (error) {
        console.error('Error generating compound description:', error);
        throw new Error('Failed to generate compound description');
    }
}
