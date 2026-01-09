import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ChevronLeft } from "lucide-react";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { ButtonWrapper } from "@/components/wrapper/ButtonWrapper";
import { FormUpdatePassword } from "@/types/form/auth.form";
import { Icon } from "@iconify/react/dist/iconify.js";

interface UbahPasswordSectionProps {
  nameSpace: {
    router: AppRouterInstance;
  };
  state: {
    formUpdatePassword: FormUpdatePassword;
    setFormUpdatePassword: React.Dispatch<
      React.SetStateAction<FormUpdatePassword>
    >;
    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
    showPassword: {
      password: boolean;
      confirm: boolean;
    };
    setShowPassword: React.Dispatch<
      React.SetStateAction<{
        password: boolean;
        confirm: boolean;
      }>
    >;
  };
  service: {
    onUpdate: () => void;
    isPending: boolean;
  };
}
const UbahPasswordSection: React.FC<UbahPasswordSectionProps> = ({
  nameSpace,
  state,
  service,
}) => {
  return (
    <section className="flex w-full min-h-screen flex-col items-center justify-start overflow-x-hidden space-y-2">
      <div className="w-full flex  items-center">
        <ChevronLeft
          onClick={() => nameSpace.router.back()}
          className="scale-120"
        />
        <h1 className="text-2xl font-bold">Ubah Kata Sandi</h1>
      </div>
      <p className="font-light text-lg">
        Kata sandi baru harus berbeda dari kata sandi sebelumnya dan terdiri
        dari minimal 8 karakter.
      </p>
      <div className="w-full space-y-5">
        <label className="text-lg font-bold">Kata Sandi Baru</label>
        <InputWrapper
          placeholder="Tulis kata sandi baru"
          required
          type={state.showPassword.password ? "password" : "text"}
          value={state.formUpdatePassword.password}
          rightIcon={
            <Icon
              icon={
                state.showPassword.password
                  ? "material-symbols:lock-outline"
                  : "material-symbols:lock-open-outline"
              }
              width={24}
              height={24}
              onClick={() =>
                state.setShowPassword((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              className="cursor-pointer"
            />
          }
          onChange={(e) =>
            state.setFormUpdatePassword((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />
        <label className="text-lg font-bold">Konfirmasi Kata Sandi Baru</label>
        <InputWrapper
          placeholder="Konfirmasi Kata sandi"
          required
          type={state.showPassword.confirm ? "password" : "text"}
          value={state.confirmPassword}
          rightIcon={
            <Icon
              icon={
                state.showPassword.confirm
                  ? "material-symbols:lock-outline"
                  : "material-symbols:lock-open-outline"
              }
              width={24}
              height={24}
              onClick={() =>
                state.setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              className="cursor-pointer"
            />
          }
          onChange={(e) => state.setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="mt-2 w-full">
        <ButtonWrapper
          className="w-full"
          onClick={() => service.onUpdate()}
          disabled={
            service.isPending ||
            !state.confirmPassword ||
            !state.formUpdatePassword
          }
        >
          Perbarui Kata Sandi
        </ButtonWrapper>
      </div>
    </section>
  );
};

export default UbahPasswordSection;
