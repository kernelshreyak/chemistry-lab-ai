import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import type { ChemicalCompound } from '../types/chemistry';
import FormulaRenderer from './FormulaRenderer';

interface CompoundCardProps {
    compound: ChemicalCompound;
    onClick: () => void;
    type: 'reactant' | 'product';
}

const CompoundCard: React.FC<CompoundCardProps> = ({ compound, onClick, type }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: type === 'reactant' ? 'primary.dark' : 'secondary.dark',
                background: type === 'reactant'
                    ? 'linear-gradient(135deg, rgba(0,188,212,0.1) 0%, rgba(0,139,163,0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(8,127,35,0.05) 100%)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: type === 'reactant'
                        ? '0 8px 24px rgba(0,188,212,0.3)'
                        : '0 8px 24px rgba(76,175,80,0.3)',
                    borderColor: type === 'reactant' ? 'primary.main' : 'secondary.main',
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <ScienceIcon
                        sx={{
                            mr: 1,
                            color: type === 'reactant' ? 'primary.main' : 'secondary.main',
                        }}
                    />
                    <Typography variant="h6" component="div">
                        {compound.name}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        IUPAC Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.9em' }}>
                        {compound.iupacName}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Molecular Formula
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormulaRenderer formula={compound.formula} />
                    </Box>
                </Box>

                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        SMILES
                    </Typography>
                    <Chip
                        label={compound.smiles}
                        size="small"
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75em',
                            maxWidth: '100%',
                            '& .MuiChip-label': {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        }}
                    />
                </Box>

                {compound.molecularWeight && (
                    <Typography variant="caption" color="text.secondary">
                        MW: {compound.molecularWeight.toFixed(2)} g/mol
                    </Typography>
                )}

                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        mt: 2,
                        textAlign: 'center',
                        color: type === 'reactant' ? 'primary.main' : 'secondary.main',
                        fontWeight: 600,
                    }}
                >
                    Click to view 3D structure
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CompoundCard;
