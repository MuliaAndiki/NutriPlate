import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";

import GoogleSvg from "@/components/svg/google-svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormLogin } from "@/types/form/auth.form";
import VectorSvg from "@/components/svg/vector-auth-svg";
import Image from "next/image";

interface LoginSectionProps {
  formLogin: FormLogin;
  setFormLogin: React.Dispatch<React.SetStateAction<FormLogin>>;
  isPending: boolean;
  onLogin: () => void;
  onLoginGoogle: (code: string) => void;
}
const LoginHeroSection: React.FC<LoginSectionProps> = ({
  formLogin,
  isPending,
  onLogin,
  setFormLogin,
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
    <div className="w-full h-full overflow-x-hidden">
      <div className="flex w-full flex-col justify-center h-screen bg-primary relative z-0">
        <div className="absolute top-0 z-[-1]">
          <VectorSvg />
        </div>
        <div className="flex absolute flex-col items-center top-0 w-full z-[-1]">
          <Image alt="icon" src={"/images/auth.png"} width={300} height={300} />
        </div>
        <div className="w-full h-full mt-55 bg-background flex items-center justify-start flex-col rounded-t-3xl py-5 z-0">
          <div className="w-full px-5">
            <h1 className="text-3xl font-extrabold">Masuk</h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="w-full max-w-sm flex  justify-center items-center flex-col gap-4 mt-4"
          >
            <div className="w-full">
              <label htmlFor="phone/email" className="text-lg font-semibold">
                Nomor Hp/Email :
              </label>
              <Input
                placeholder="No Hp/Email"
                type="text"
                value={formLogin.identifier}
                onChange={(e) =>
                  setFormLogin((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-full max-w-sm ">
              <label htmlFor="password" className="text-lg font-semibold">
                Kata Sandi :
              </label>
              <Input
                placeholder="Kata Sandi"
                type="password"
                value={formLogin.password}
                onChange={(e) =>
                  setFormLogin((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              <div className="w-full mt-2">
                <Link href="/forgot-password">
                  <p className="text-sm hover:underline text-blue-500">
                    Lupa Kata Sandi?
                  </p>
                </Link>
              </div>
            </div>
            <div className="w-full max-w-sm ">
              <Button
                className="w-full"
                variant={"btn"}
                disabled={
                  isPending || !formLogin.identifier || !formLogin.password
                }
                type="submit"
              >
                {isPending ? <Spinner /> : "Masuk"}
              </Button>
            </div>
            <p>
              Belum Memiliki Akun?
              <Link href={"/register"}>
                <span className="text-primary">Daftar</span>
              </Link>
            </p>

            <div className="w-full flex justify-center items-center flex-col space-y-3">
              <h1 className="text-lg font-bold">Atau Masuk Dengan</h1>
              <button type="button" onClick={() => googleLogin()}>
                <GoogleSvg />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginHeroSection;
