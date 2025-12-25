import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormForgotPassword } from "@/types/form/auth.form";
interface ForgotProps {
  formForgotPassword: FormForgotPassword;
  setFormForgotPassword: React.Dispatch<
    React.SetStateAction<FormForgotPassword>
  >;
  isPending: boolean;
  onForgot: () => void;
  router: AppRouterInstance;
}
const ForgotPasswordHeroSection: React.FC<ForgotProps> = ({
  formForgotPassword,
  isPending,
  onForgot,
  setFormForgotPassword,
  router,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col">
      <div className="flex w-full justify-center items-center relative">
        <div className="absolute left-0">
          <ChevronLeft size={50} onClick={() => router.back()} />
        </div>
        <h1 className="text-4xl font-extrabold text-start">Lupa Kata Sandi</h1>
      </div>

      <div className="w-full max-w-sm flex justify-center items-center flex-col">
        <p className="text-lg font-light text-center">
          Masukkan Nomor Hp atau Email Anda untuk ubah password
        </p>
        <form
          className="w-full space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onForgot();
          }}
        >
          <div className="w-full my-4">
            <label htmlFor="nomorHp/Email" className="font-bold text-lg">
              Nomor Hp/Email:
            </label>
            <Input
              placeholder="No Hp/Email"
              required
              value={formForgotPassword.identifier}
              onChange={(e) =>
                setFormForgotPassword((prev) => ({
                  ...prev,
                  identifier: e.target.value,
                }))
              }
            />
          </div>
          <Button className="w-full " variant={"btn"} disabled={isPending}>
            {isPending ? <Spinner /> : "Kirim Kode Otp"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordHeroSection;
