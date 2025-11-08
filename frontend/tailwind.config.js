/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                // Candle & Perfume Theme
                "candle-white": "#f5f5f0",
                "candle-yellow": "#ffd700",
                "bright-yellow": "#ffeb3b",
                "dark-bg": "#0a0a0a",
                "darker-bg": "#000000",
                "card-bg": "#1a1a1a",
                "primary-gold": "#d4af37",
                "secondary-gold": "#c9a027",
                "accent-red": "#e63946",
                "success-green": "#2ecc71",
                "border-color": "#333333",
                "border-light": "#444444",
                "text-primary": "#ffffff",
                "text-secondary": "#b0b0b0",
                "text-muted": "#808080",
            },
            backgroundImage: {
                "gold-gradient":
                    "linear-gradient(135deg, #d4af37 0%, #f0d77d 100%)",
                "yellow-gradient":
                    "linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%)",
                "hero-gradient":
                    "linear-gradient(135deg, rgba(25, 25, 35, 0.8) 0%, rgba(40, 30, 20, 0.75) 100%)",
            },
            boxShadow: {
                "gold-sm": "0 5px 15px rgba(212, 175, 55, 0.3)",
                "gold-md": "0 15px 50px rgba(212, 175, 55, 0.5)",
                "gold-lg": "0 30px 100px rgba(212, 175, 55, 0.7)",
                "yellow-sm": "0 5px 15px rgba(255, 215, 0, 0.4)",
                "yellow-md": "0 15px 50px rgba(255, 215, 0, 0.6)",
                glow: "0 4px 20px rgba(255, 215, 0, 0.1)",
            },
            animation: {
                float: "float 3s ease-in-out infinite",
                slideUp: "slideUp 0.8s ease",
                slideIn: "slideIn 0.5s ease",
                fadeIn: "fadeIn 0.5s ease",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-15px)" },
                },
                slideUp: {
                    "0%": { transform: "translateY(30px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateX(-20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
