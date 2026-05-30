import { CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";

export default function Toast({ message }) {
  if (!message) return null;

  return createPortal(
    <div className="toast toast-top" role="status" aria-live="polite">
      <CheckCircle2 size={18} />
      <span>{message}</span>
    </div>,
    document.body
  );
}
