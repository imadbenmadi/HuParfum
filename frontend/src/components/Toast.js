import React, { useState, useEffect, createContext, useContext } from "react";

// Create Toast context
const ToastContext = createContext();

// Toast notification component - supports success, error, info, warning
export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const addToast = (message, type = "info", duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
                {toasts &&
                    toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ id, type, message, duration = 5000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✓";
            case "error":
                return "✕";
            case "warning":
                return "⚠";
            case "info":
                return "ⓘ";
            default:
                return "•";
        }
    };

    const getStyles = () => {
        switch (type) {
            case "success":
                return "bg-green-500/90 border-green-500/50 text-white";
            case "error":
                return "bg-red-500/90 border-red-500/50 text-white";
            case "warning":
                return "bg-yellow-500/90 border-yellow-500/50 text-white";
            case "info":
                return "bg-blue-500/90 border-blue-500/50 text-white";
            default:
                return "bg-gray-500/90 border-gray-500/50 text-white";
        }
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm animate-slideIn shadow-lg min-w-[280px] pointer-events-auto ${getStyles()}`}
        >
            <span className="text-lg font-bold">{getIcon()}</span>
            <span className="flex-1 font-medium">{message}</span>
            <button
                onClick={onClose}
                className="text-xl leading-none hover:opacity-75 transition-opacity"
            >
                ×
            </button>
        </div>
    );
};

// Hook for using toasts
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastContainer");
    }
    return context;
};

export default Toast;
