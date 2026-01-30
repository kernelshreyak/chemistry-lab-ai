import React, { useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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

const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ open, onClose, compound }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewer = useRef<any>(null);

    useEffect(() => {
        if (!open || !compound || !viewerRef.current) return;

        // Load 3Dmol.js library dynamically
        const script = document.createElement('script');
        script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
        script.async = true;
        script.onload = () => {
            initializeViewer();
        };

        if (!document.querySelector('script[src*="3Dmol"]')) {
            document.head.appendChild(script);
        } else {
            initializeViewer();
        }

        return () => {
            if (viewer.current) {
                viewer.current.clear();
            }
        };
    }, [open, compound]);

    const initializeViewer = () => {
        if (!viewerRef.current || !window.$3Dmol) return;

        viewer.current = window.$3Dmol.createViewer(viewerRef.current, {
            backgroundColor: '#132f4c',
        });

        if (compound?.smiles) {
            // Use SMILES to generate 3D structure
            // This is a simplified approach - in production, you'd fetch proper 3D coordinates
            try {
                viewer.current.addModel(`${compound.smiles}`, 'smi');
                viewer.current.setStyle({}, { stick: { colorscheme: 'Jmol' } });
                viewer.current.zoomTo();
                viewer.current.render();
                viewer.current.zoom(1.2);
            } catch (error) {
                console.error('Error rendering molecule:', error);
            }
        }
    };

    if (!compound) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    minHeight: '500px',
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
                <Box
                    ref={viewerRef}
                    sx={{
                        width: '100%',
                        height: '400px',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                    }}
                />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>SMILES:</strong> {compound.smiles}
                    </Typography>
                    {compound.molecularWeight && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            <strong>Molecular Weight:</strong> {compound.molecularWeight.toFixed(2)} g/mol
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default MoleculeViewer;
