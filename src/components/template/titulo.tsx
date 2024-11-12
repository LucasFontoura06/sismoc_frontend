import { useTheme } from '@mui/material/styles';

export default function Titulo(props: any) {
    const theme = useTheme();

    return (
        <div style={{
            background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(to bottom right, #0a0a0a, #2c2c2c)'
                : 'linear-gradient(to bottom right, #ffffff, #f0f0f0)',
            padding: '1rem',
            color: theme.palette.text.primary,
        }}>
            <h1 className="text-2xl font-bold">{props.children}</h1>
        </div>
    );
}