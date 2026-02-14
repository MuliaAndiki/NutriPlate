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

interface VerifikasiOtpProps {
  state: {
    formVerifyOtp: FormVerify;
    setFormVerifyOtp: React.Dispatch<React.SetStateAction<FormVerify>>;
    hashIdentifer: string;
    colldown: number;
  };
  service: {
    mutation: {
      isPending: boolean;
      onVerify: () => void;
      resendOtp: () => void;
    };
  };
}

const VerifyOtpHeroSection: React.FC<VerifikasiOtpProps> = ({
  service,
  state,
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
          service.mutation.onVerify();
        }}
      >
        <div className="w-full max-w-sm flex justify-center items-center flex-col space-y-5">
          <h1 className="text-center font-semibold">
            Kami telah mengirimkan kode verifikasi 6 digit ke Email ****
            {state.hashIdentifer}
          </h1>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={state.formVerifyOtp.otp}
            required
            onChange={(e) =>
              state.setFormVerifyOtp((prev) => ({
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
            {state.colldown > 0 ? (
              <span className="text-primary">
                Kirim Ulang OTP ({Math.floor(state.colldown / 60)}:
                {(state.colldown % 60).toString().padStart(2, "0")})
              </span>
            ) : (
              <span
                className="text-primary"
                onClick={() => service.mutation.resendOtp()}
              >
                Kirim Ulang OTP
              </span>
            )}
          </p>

          <Button
            className="w-full text-bold"
            variant={"btn"}
            type="submit"
            disabled={service.mutation.isPending}
          >
            {service.mutation.isPending ? <Spinner /> : "Verifikasi"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpHeroSection;
