import { forwardRef, useImperativeHandle, useRef } from "react";

import { UploadsTriggerProps } from "@/types/utils";

export interface UploadTriggerRef {
  resetInput: () => void;
}

const UploadsTrigger = forwardRef<UploadTriggerRef, UploadsTriggerProps>(
  ({ children, onChange, accept, multiple, className, disable }, ref) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleTrigger = () => {
      if (disable) return;
      fileRef.current?.click();
    };

    useImperativeHandle(ref, () => ({
      resetInput: () => {
        if (fileRef.current) fileRef.current.value = "";
      },
    }));

    return (
      <>
        <div className={className} onClick={handleTrigger}>
          {children}
        </div>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={onChange}
          accept={accept}
          multiple={multiple}
          disabled={disable}
        />
      </>
    );
  },
);

UploadsTrigger.displayName = "UploadsTrigger";
export default UploadsTrigger;
