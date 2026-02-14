import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { FormVerify } from "@/types/form/auth.form";

interface VerifikasiProps {
  formVerifyOtp: FormVerify;
  setFormVerifyOtp: React.Dispatch<React.SetStateAction<FormVerify>>;
  isPending: boolean;
  onVerify: () => void;
  colldown: number;
  resendOtp: () => void;
  hashIdentifer: string;
}

const VerifyHeroSection: React.FC<VerifikasiProps> = ({
  formVerifyOtp,
  isPending,
  onVerify,
  setFormVerifyOtp,
  resendOtp,
  colldown,
  hashIdentifer,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col">
      <h1 className="font-bold text-4xl">Verifikasi OTP</h1>
      <Image
        alt="pitch"
        src={"/images/verifyOtp.png"}
        width={500}
        height={500}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onVerify();
        }}
      >
        <div className="w-full max-w-sm flex justify-center items-center flex-col space-y-5">
          <h1 className="text-center font-semibold">
            Kami telah mengirimkan kode verifikasi 6 digit ke Email ****
            {hashIdentifer}
          </h1>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={formVerifyOtp.otp}
            required
            onChange={(e) =>
              setFormVerifyOtp((prev) => ({
                ...prev,
                otp: e,
              }))
            }
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <p>
            Tidak Menerima Kode ?
            {colldown > 0 ? (
              <span className="text-primary">
                Kirim Ulang OTP ({Math.floor(colldown / 60)}:
                {(colldown % 60).toString().padStart(2, "0")})
              </span>
            ) : (
              <span className="text-primary" onClick={() => resendOtp()}>
                Kirim Ulang OTP
              </span>
            )}
          </p>

          <Button
            className="w-full text-bold"
            variant={"btn"}
            type="submit"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Verifikasi"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerifyHeroSection;
