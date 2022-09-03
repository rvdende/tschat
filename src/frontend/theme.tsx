import { createTheme } from "@mui/material";

export const chattheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#1bc597",
        },
        secondary: {
            main: "#15b6e7",
            contrastText: "rgba(255,255,255,1)",
        },
        background: {
            default: "#221e1e",
            paper: "#2d2429",
        },
        text: {
            primary: "#ffffff",
        },
    },
});