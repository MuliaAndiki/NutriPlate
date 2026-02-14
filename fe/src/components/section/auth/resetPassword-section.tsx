import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormResetPassword } from "@/types/form/auth.form";

interface ResetPasswordSectionProps {
  namespace: {
    router: AppRouterInstance;
  };
  state: {
    formResetPassword: FormResetPassword;
    setFormResetPassword: React.Dispatch<
      React.SetStateAction<FormResetPassword>
    >;
    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  };
  service: {
    mutation: {
      isPending: boolean;
      onReset: () => void;
    };
  };
}
const ResetPasswordHeroSection: React.FC<ResetPasswordSectionProps> = ({
  namespace,
  service,
  state,
}) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col">
      <div className="flex justify-center items-center  w-full">
        <div className="absolute left-0">
          <ChevronLeft size={50} onClick={() => namespace.router.back()} />
        </div>
        <h1 className="text-4xl font-extrabold">Ganti Kata Sandi</h1>
      </div>
      <div className="w-full max-w-sm my-4">
        <h1 className="text-center ">
          Kata sandi baru harus berbeda dari kata sandi sebelumnya dan terdiri
          dari minimal 8 karakter.
        </h1>
      </div>
      <form
        className="w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          service.mutation.onReset();
        }}
      >
        <div className="w-full ">
          <label className="font-bold text-lg">Kata Sandi Baru</label>
          <Input
            placeholder="Kata Sandi Minimal 8 Karakter"
            value={state.formResetPassword.password}
            required
            type="password"
            onChange={(e) =>
              state.setFormResetPassword((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </div>
        <div className="w-full ">
          <label className="font-bold text-lg">
            Konfirmasi Kata Sandi Baru
          </label>
          <Input
            placeholder="Konfirmasi Kata Sandi"
            value={state.confirmPassword}
            required
            type="password"
            onChange={(e) => state.setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="w-full mt-4 ">
          <Button
            variant={"btn"}
            className="w-full"
            disabled={service.mutation.isPending}
            type="submit"
          >
            {service.mutation.isPending ? <Spinner /> : "Perbarui Kata Sandi"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordHeroSection;
