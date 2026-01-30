import React, { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Typography,
    Grid,
    CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScienceIcon from '@mui/icons-material/Science';
import type { ReactionScenario } from '../types/chemistry';

interface ReactionInputProps {
    onPredict: (scenario: ReactionScenario) => void;
    loading: boolean;
}

const ReactionInput: React.FC<ReactionInputProps> = ({ onPredict, loading }) => {
    const [description, setDescription] = useState('');
    const [conditions, setConditions] = useState('');
    const [temperature, setTemperature] = useState('');
    const [catalyst, setCatalyst] = useState('');

    const handleSubmit = () => {
        if (!description.trim()) return;

        const scenario: ReactionScenario = {
            description: description.trim(),
            conditions: conditions.trim() || undefined,
            temperature: temperature ? parseFloat(temperature) : undefined,
            catalyst: catalyst.trim() || undefined,
        };

        onPredict(scenario);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
        }
    };

    return (
        <Card
            sx={{
                background: 'linear-gradient(135deg, rgba(0,188,212,0.05) 0%, rgba(19,47,76,0.8) 100%)',
                border: '1px solid',
                borderColor: 'primary.dark',
            }}
        >
            <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ScienceIcon sx={{ mr: 1, color: 'primary.main' }} />
                    Define Reaction Scenario
                </Typography>

                <Box component="form" onSubmit={(e) => e.preventDefault()}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reaction Description"
                        placeholder="e.g., Combustion of methane in oxygen"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyPress={handleKeyPress}
                        required
                        sx={{ mb: 2 }}
                        disabled={loading}
                    />

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Temperature (°C)"
                                type="number"
                                placeholder="25"
                                value={temperature}
                                onChange={(e) => setTemperature(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Catalyst"
                                placeholder="e.g., Platinum"
                                value={catalyst}
                                onChange={(e) => setCatalyst(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Conditions"
                                placeholder="e.g., High pressure"
                                value={conditions}
                                onChange={(e) => setConditions(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!description.trim() || loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #00bcd4 30%, #4caf50 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #008ba3 30%, #087f23 90%)',
                            },
                        }}
                    >
                        {loading ? 'Predicting Reaction...' : 'Predict Reaction'}
                    </Button>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                        Press Ctrl+Enter to predict
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReactionInput;
