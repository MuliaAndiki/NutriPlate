import { useGoogleLogin } from "@react-oauth/google";
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
import VectorSvg from "@/components/svg/vector-auth-svg";
import Image from "next/image";

interface RegisterProps {
  state: {
    formRegister: FormRegister;
    setFormRegister: React.Dispatch<React.SetStateAction<FormRegister>>;
  };
  service: {
    mutation: {
      isPending: boolean;
      onRegister: () => void;
      onLoginGoogle: (code: string) => void;
    };
  };
}
const RegisterHeroSection: React.FC<RegisterProps> = ({ service, state }) => {
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      service.mutation.onLoginGoogle(codeResponse.code);
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="flex w-full flex-col justify-center h-screen bg-primary relative z-0">
        <div className="absolute top-0 z-[-1]">
          <VectorSvg />
        </div>
        <div className="flex absolute flex-col items-center top-0 w-full z-[-1]">
          <Image alt="icon" src={"/images/auth.png"} width={300} height={300} />
        </div>
        <div className="w-full h-full mt-55 bg-background flex items-center justify-start flex-col rounded-t-3xl py-5 z-0">
          <div className="w-full px-6">
            <h1 className="text-3xl font-bold">Daftar Akun</h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              service.mutation.onRegister();
            }}
            className="w-full max-w-sm flex justify-center items-center flex-col gap-4 mt-4"
          >
            <div className="w-full">
              <label htmlFor="Nomor Hp" className="font-bold text-lg">
                Nomor HP/Email:
              </label>
              <Input
                placeholder="No Hp/Email"
                value={state.formRegister.identifier}
                onChange={(e) =>
                  state.setFormRegister((prev) => ({
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
                value={state.formRegister.fullName}
                onChange={(e) =>
                  state.setFormRegister((prev) => ({
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
                value={state.formRegister.password}
                onChange={(e) =>
                  state.setFormRegister((prev) => ({
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
                value={state.formRegister.role}
                onValueChange={(value) =>
                  state.setFormRegister((prev) => ({
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
                disabled={
                  service.mutation.isPending ||
                  !state.formRegister.fullName ||
                  !state.formRegister.identifier ||
                  !state.formRegister.password ||
                  !state.formRegister.role
                }
              >
                {service.mutation.isPending ? <Spinner /> : "Daftar"}
              </Button>
            </div>

            <div className="w-full flex justify-center items-center flex-col space-y-3">
              <h1 className="text-lg font-bold">Atau Masuk Dengan</h1>
              <button
                type="button"
                disabled={service.mutation.isPending}
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
    </div>
  );
};

export default RegisterHeroSection;
