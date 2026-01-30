export interface ChemicalCompound {
    name: string;
    iupacName: string;
    smiles: string;
    formula: string;
    molecularWeight?: number;
    structure3D?: string;
}

export interface ReactionScenario {
    description: string;
    conditions?: string;
    temperature?: number;
    catalyst?: string;
}

export interface ChemicalReaction {
    reactants: ChemicalCompound[];
    products: ChemicalCompound[];
    scenario: ReactionScenario;
    balancedEquation?: string;
}
