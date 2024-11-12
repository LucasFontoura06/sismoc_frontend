import { useTheme } from '@mui/material/styles';

export const useThemeColors = () => {
    const theme = useTheme();

    return {
        primary: theme.palette.primary.main,
        primaryLight: theme.palette.primary.light,
    };
};