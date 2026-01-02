export interface UploadsTriggerProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  className?: string;
  disable?: boolean;
}
