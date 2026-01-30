import React, { useState } from 'react';
import { Box, Grid, Typography, Divider, Paper, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { ChemicalReaction, ChemicalCompound } from '../types/chemistry';
import CompoundCard from './CompoundCard';
import MoleculeViewer from './MoleculeViewer';

interface ReactionDisplayProps {
    reaction: ChemicalReaction | null;
}

const ReactionDisplay: React.FC<ReactionDisplayProps> = ({ reaction }) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedCompound, setSelectedCompound] = useState<ChemicalCompound | null>(null);

    if (!reaction) {
        return (
            <Paper
                sx={{
                    p: 8,
                    textAlign: 'center',
                    background: 'transparent',
                    border: '2px dashed',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Enter a reaction scenario above to get started
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    AI will predict reactants and products with detailed chemical information
                </Typography>
            </Paper>
        );
    }

    const handleCompoundClick = (compound: ChemicalCompound) => {
        setSelectedCompound(compound);
        setViewerOpen(true);
    };

    return (
        <Box>
            {/* Reaction Info */}
            <Paper sx={{ p: 3, mb: 3, background: 'rgba(0,188,212,0.05)' }}>
                <Typography variant="h6" gutterBottom>
                    Reaction Scenario
                </Typography>
                <Typography variant="body1" paragraph>
                    {reaction.scenario.description}
                </Typography>
                {(reaction.scenario.temperature || reaction.scenario.catalyst || reaction.scenario.conditions) && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {reaction.scenario.temperature && (
                            <Chip label={`${reaction.scenario.temperature}°C`} size="small" color="primary" variant="outlined" />
                        )}
                        {reaction.scenario.catalyst && (
                            <Chip label={`Catalyst: ${reaction.scenario.catalyst}`} size="small" color="secondary" variant="outlined" />
                        )}
                        {reaction.scenario.conditions && (
                            <Chip label={reaction.scenario.conditions} size="small" variant="outlined" />
                        )}
                    </Box>
                )}
            </Paper>

            {/* Balanced Equation */}
            {reaction.balancedEquation && (
                <Paper sx={{ p: 3, mb: 3, textAlign: 'center', background: 'rgba(76,175,80,0.05)' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Balanced Chemical Equation
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Georgia, serif' }}>
                        {reaction.balancedEquation}
                    </Typography>
                </Paper>
            )}

            {/* Reactants */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            mr: 1.5,
                        }}
                    />
                    Reactants
                </Typography>
                <Grid container spacing={3}>
                    {reaction.reactants.map((reactant, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CompoundCard
                                compound={reactant}
                                onClick={() => handleCompoundClick(reactant)}
                                type="reactant"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Arrow Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4 }}>
                <Divider sx={{ flex: 1 }} />
                <ArrowForwardIcon sx={{ mx: 2, fontSize: 40, color: 'primary.main' }} />
                <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Products */}
            <Box>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'secondary.main',
                            mr: 1.5,
                        }}
                    />
                    Products
                </Typography>
                <Grid container spacing={3}>
                    {reaction.products.map((product, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CompoundCard
                                compound={product}
                                onClick={() => handleCompoundClick(product)}
                                type="product"
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* 3D Viewer Modal */}
            <MoleculeViewer
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                compound={selectedCompound}
            />
        </Box>
    );
};

export default ReactionDisplay;
