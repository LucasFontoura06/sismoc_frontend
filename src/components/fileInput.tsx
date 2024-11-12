import { TextField, IconButton, useTheme } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import React, { useState, useEffect } from "react";

const FileInputForm = (props: any) => {
    const {
        label,
        name,
        onChange,
        isInvalid,
        msgError,
        customStyles,
        InputProps,
        inputRef,
    } = props;

    const theme = useTheme();
    const [fileName, setFileName] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
        if (onChange) {
            onChange(event);
        }
    };

    useEffect(() => {
        if (inputRef?.current) {
            setFileName("");
        }
    }, [inputRef]);

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <TextField
                label={label}
                fullWidth
                value={fileName}
                error={isInvalid}
                helperText={msgError}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                        },
                        "&:hover fieldset": {
                            borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                        },
                        "& input": {
                            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    },
                    "& .MuiSvgIcon-root": {
                        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    },
                    ...(customStyles || {}),
                }}
                InputProps={{
                    ...InputProps,
                    readOnly: true,
                    endAdornment: (
                        <IconButton>
                            <UploadFileIcon sx={{ 
                                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' 
                            }} />
                        </IconButton>
                    ),
                }}
            />

            <input
                type="file"
                name={name}
                onChange={handleFileChange}
                ref={inputRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                }}
            />
        </div>
    );
};

export default FileInputForm;
