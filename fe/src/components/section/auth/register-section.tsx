import { useGoogleLogin } from "@react-oauth/google";
import { ChevronLeft } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";

import GoogleSvg from "@/components/svg/google-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { FormRegister } from "@/types/form/auth.form";

interface RegisterProps {
  formRegister: FormRegister;
  setFormRegister: React.Dispatch<React.SetStateAction<FormRegister>>;
  isPending: boolean;
  onRegister: () => void;
  router: AppRouterInstance;
  onLoginGoogle: (code: string) => void;
}
const RegisterHeroSection: React.FC<RegisterProps> = ({
  formRegister,
  isPending,
  onRegister,
  setFormRegister,
  router,
  onLoginGoogle,
}) => {
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      onLoginGoogle(codeResponse.code);
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="w-full min-h-screen flex justify-center items-center flex-col space-y-5">
        <div className="flex justify-center items-center w-full relative">
          <h1 className="text-4xl font-extrabold">Daftar Akun</h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRegister();
          }}
          className="w-full max-w-sm flex justify-center items-center flex-col gap-4 mt-4"
        >
          <div className="w-full">
            <label htmlFor="Nomor Hp" className="font-bold text-lg">
              Nomor HP/Email:
            </label>
            <Input
              placeholder="No Hp/Email"
              value={formRegister.identifier}
              onChange={(e) =>
                setFormRegister((prev) => ({
                  ...prev,
                  identifier: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-full">
            <label htmlFor="fullname" className="font-bold text-lg">
              Nama Lengkap:
            </label>
            <Input
              placeholder="Masukkan Nama lengkap Anda"
              value={formRegister.fullName}
              onChange={(e) =>
                setFormRegister((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-full">
            <label htmlFor="password" className="text-lg font-bold">
              Kata Sandi:
            </label>
            <Input
              placeholder="Kata Sandi Minimal 8 Karakter"
              type="password"
              value={formRegister.password}
              onChange={(e) =>
                setFormRegister((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-full">
            <label htmlFor="role" className="text-lg font-bold">
              Peran:
            </label>
            <Select
              value={formRegister.role}
              onValueChange={(value) =>
                setFormRegister((prev) => ({
                  ...prev,
                  role: value,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Peran" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Peran</SelectLabel>
                  <SelectItem value="PARENT">Parent</SelectItem>
                  <SelectItem value="KADER">Kader</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Button
              className="w-full"
              variant={"btn"}
              type="submit"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Daftar"}
            </Button>
          </div>

          <div className="w-full flex justify-center items-center flex-col space-y-3">
            <h1 className="text-lg font-bold">Atau Masuk Dengan</h1>
            <button
              type="button"
              disabled={isPending}
              onClick={() => googleLogin()}
            >
              <GoogleSvg />
            </button>
            <p>
              Sudah Memiliki Akun?
              <Link href={"/login"}>
                <span className="text-primary">Masuk</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterHeroSection;
