import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}));

export const StyledScrollbar = styled('div')(({ theme }) => ({
    maxHeight: '100%',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: alpha(theme.palette.grey[600], 0.48),
        borderRadius: '8px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
    },
}));
