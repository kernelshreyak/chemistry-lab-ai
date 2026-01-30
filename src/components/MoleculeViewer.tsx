import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Divider,
    Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import axios from 'axios';
import type { ChemicalCompound } from '../types/chemistry';

interface MoleculeViewerProps {
    open: boolean;
    onClose: () => void;
    compound: ChemicalCompound | null;
}

declare global {
    interface Window {
        $3Dmol: any;
    }
}

// Cache for 3D structures
const structure3DCache: Record<string, string> = {};

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ open, onClose, compound }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstance = useRef<any>(null);
    const [loading3D, setLoading3D] = useState(false);
    const [loadingDescription, setLoadingDescription] = useState(false);
    const [error3D, setError3D] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [structure3DLoaded, setStructure3DLoaded] = useState(false);
    const [description, setDescription] = useState<string>('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // Load 3Dmol.js script
    useEffect(() => {
        if (window.$3Dmol) {
            setScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
        script.async = true;
        script.onload = () => {
            console.log('3Dmol.js loaded successfully');
            setScriptLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load 3Dmol.js');
            setError3D('Failed to load 3D visualization library');
        };

        document.head.appendChild(script);
    }, []);

    // Check if structure is cached when modal opens
    useEffect(() => {
        if (open && compound) {
            setStructure3DLoaded(!!structure3DCache[compound.smiles]);
            setDescription('');
        }
    }, [open, compound]);

    const load3DStructure = async () => {
        if (!compound || !scriptLoaded || !viewerRef.current) return;

        console.log('Loading 3D structure for:', compound.name);
        setLoading3D(true);
        setError3D(null);

        try {
            // Clear previous viewer
            if (viewerInstance.current) {
                viewerInstance.current.clear();
            }

            // Create new viewer
            viewerInstance.current = window.$3Dmol.createViewer(viewerRef.current, {
                backgroundColor: '#132f4c',
            });

            let sdfData: string;

            // Check cache first
            if (structure3DCache[compound.smiles]) {
                console.log('Using cached 3D structure');
                sdfData = structure3DCache[compound.smiles];
            } else {
                console.log('Fetching 3D structure from PubChem...');
                const smiles = encodeURIComponent(compound.smiles);
                const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${smiles}/SDF?record_type=3d`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`PubChem API returned ${response.status}`);
                }

                sdfData = await response.text();

                // Cache the structure
                structure3DCache[compound.smiles] = sdfData;
                console.log('3D structure cached');
            }

            // Add model to viewer
            viewerInstance.current.addModel(sdfData, 'sdf');

            // Set style
            viewerInstance.current.setStyle({}, {
                stick: {
                    colorscheme: 'Jmol',
                    radius: 0.15
                },
                sphere: {
                    scale: 0.25,
                    colorscheme: 'Jmol'
                }
            });

            // Render
            viewerInstance.current.zoomTo();
            viewerInstance.current.render();
            viewerInstance.current.zoom(0.8);
            viewerInstance.current.rotate(45, { x: 1, y: 1, z: 0 });

            console.log('3D structure rendered successfully');
            setStructure3DLoaded(true);
            setLoading3D(false);

        } catch (err: any) {
            console.error('Error rendering 3D structure:', err);
            setError3D(err.message || 'Failed to load 3D structure');
            setLoading3D(false);
        }
    };

    const generateDescription = async () => {
        if (!compound) return;

        console.log('Generating description for:', compound.name);
        setLoadingDescription(true);
        setErrorDescription(null);

        try {
            const response = await axios.post(`${API_URL}/api/reactions/compound-description`, {
                name: compound.name,
                iupacName: compound.iupacName,
                smiles: compound.smiles,
                formula: compound.formula,
            });

            setDescription(response.data.description);
            setLoadingDescription(false);
        } catch (err: any) {
            console.error('Error generating description:', err);
            setErrorDescription(err.response?.data?.error || 'Failed to generate description');
            setLoadingDescription(false);
        }
    };

    if (!compound) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '600px',
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6">{compound.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {compound.iupacName}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={structure3DLoaded ? <RefreshIcon /> : <ViewInArIcon />}
                        onClick={load3DStructure}
                        disabled={loading3D || !scriptLoaded}
                        sx={{
                            background: 'linear-gradient(45deg, #00bcd4 30%, #4caf50 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #008ba3 30%, #087f23 90%)',
                            },
                        }}
                    >
                        {loading3D ? 'Loading...' : structure3DLoaded ? 'Reload 3D Model' : 'Load 3D Model'}
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DescriptionIcon />}
                        onClick={generateDescription}
                        disabled={loadingDescription}
                        color="secondary"
                    >
                        {loadingDescription ? 'Generating...' : 'Generate Description'}
                    </Button>
                </Box>

                <Box
                    ref={viewerRef}
                    sx={{
                        width: '100%',
                        height: '400px',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}
                >
                    {!structure3DLoaded && !loading3D && (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <ViewInArIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                Click "Load 3D Model" to visualize the molecule
                            </Typography>
                        </Box>
                    )}
                    {loading3D && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            position: 'absolute',
                            zIndex: 10
                        }}>
                            <CircularProgress />
                            <Typography variant="body2" color="text.secondary">
                                Loading 3D structure...
                            </Typography>
                        </Box>
                    )}
                </Box>

                {error3D && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {error3D}
                    </Alert>
                )}

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>SMILES:</strong> {compound.smiles}
                    </Typography>
                    {compound.molecularWeight && (
                        <Typography variant="body2" color="text.secondary">
                            <strong>Molecular Weight:</strong> {compound.molecularWeight.toFixed(2)} g/mol
                        </Typography>
                    )}
                    {compound.formula && (
                        <Typography variant="body2" color="text.secondary">
                            <strong>Formula:</strong> {compound.formula}
                        </Typography>
                    )}
                </Box>

                {structure3DLoaded && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        💡 Tip: Drag to rotate the molecule manually.
                    </Typography>
                )}

                {(description || loadingDescription) && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Paper elevation={0} sx={{ p: 2, backgroundColor: 'rgba(0,188,212,0.05)' }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DescriptionIcon />
                                Compound Description
                            </Typography>
                            {loadingDescription ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                                    <CircularProgress size={24} />
                                    <Typography variant="body2" color="text.secondary">
                                        Generating AI-powered description...
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: 1.8
                                    }}
                                >
                                    {description}
                                </Typography>
                            )}
                        </Paper>
                    </>
                )}

                {errorDescription && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorDescription}
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MoleculeViewer;
