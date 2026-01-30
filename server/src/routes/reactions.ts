import express, { Request, Response } from 'express';
import { predictReaction, getCompoundDetails, generate3DStructure } from '../services/chemistryAI.js';
import { ReactionScenario } from '../types/chemistry.js';

const router = express.Router();

// POST /api/reactions/predict - Predict chemical reaction
router.post('/predict', async (req: Request, res: Response) => {
    try {
        const scenario: ReactionScenario = req.body;

        if (!scenario.description) {
            return res.status(400).json({ error: 'Reaction description is required' });
        }

        const reaction = await predictReaction(scenario);
        res.json(reaction);
    } catch (error) {
        console.error('Error in /predict:', error);
        res.status(500).json({ error: 'Failed to predict reaction' });
    }
});

// GET /api/reactions/compound/:smiles - Get compound details
router.get('/compound/:smiles', async (req: Request, res: Response) => {
    try {
        const { smiles } = req.params;
        const compound = await getCompoundDetails(decodeURIComponent(smiles));

        if (!compound) {
            return res.status(404).json({ error: 'Compound not found' });
        }

        res.json(compound);
    } catch (error) {
        console.error('Error in /compound:', error);
        res.status(500).json({ error: 'Failed to get compound details' });
    }
});

// POST /api/reactions/3d-structure - Generate 3D structure
router.post('/3d-structure', async (req: Request, res: Response) => {
    try {
        const { smiles } = req.body;

        if (!smiles) {
            return res.status(400).json({ error: 'SMILES notation is required' });
        }

        const structure = await generate3DStructure(smiles);
        res.json({ structure });
    } catch (error) {
        console.error('Error in /3d-structure:', error);
        res.status(500).json({ error: 'Failed to generate 3D structure' });
    }
});

export default router;
