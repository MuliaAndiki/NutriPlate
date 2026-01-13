import { PopUpProps } from "../../types/ui";

const PopUp: React.FC<PopUpProps> = ({
  isOpen,
  children,
  onClose,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${
        className || ""
      } fixed inset-0 bg-[rgba(67,67,67,0.5)] z-50 flex items-center justify-center p-4`}
      onClick={onClose}
    >
      <div
        className="bg-background p-6 rounded-md shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default PopUp;
