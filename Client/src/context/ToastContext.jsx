import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (title, description, variant = "default") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, open: true, title, description, variant }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.map(t => t.id === id ? { ...t, open: false } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, open: false } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  };

  const getVariantStyles = (variant) => {
    const styles = {
      default: "bg-white border-gray-200",
      success: "bg-green-50 border-green-200",
      error: "bg-red-50 border-red-200",
      warning: "bg-amber-50 border-amber-200",
      info: "bg-blue-50 border-blue-200",
    };
    return styles[variant] || styles.default;
  };

  const getIcon = (variant) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    switch (variant) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case "error":
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case "warning":
        return <AlertTriangle className={`${iconClass} text-amber-600`} />;
      case "info":
        return <Info className={`${iconClass} text-blue-600`} />;
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast.Provider>
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            open={toast.open}
            onOpenChange={(open) => !open && removeToast(toast.id)}
            className={`${getVariantStyles(
              toast.variant
            )} border rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-md backdrop-blur-sm transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full`}
          >
            {getIcon(toast.variant)}
            
            <div className="flex-1 space-y-1">
              <Toast.Title className="font-semibold text-gray-900 text-sm">
                {toast.title}
              </Toast.Title>
              {toast.description && (
                <Toast.Description className="text-gray-600 text-sm leading-relaxed">
                  {toast.description}
                </Toast.Description>
              )}
            </div>

            <Toast.Close className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport className="fixed top-0 right-0 flex flex-col gap-2 p-6 w-full max-w-md z-50 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

