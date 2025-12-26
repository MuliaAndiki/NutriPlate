import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormLogin } from "@/types/form/auth.form";
import GoogleSvg from "@/components/svg/google-svg";
import { useGoogleLogin } from "@react-oauth/google";

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
      <div className="w-full min-h-screen flex justify-center items-center space-y-5 flex-col ">
        <h1 className="text-4xl font-extrabold">Masuk</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
          className="w-full max-w-sm flex justify-center items-center flex-col gap-4 mt-4"
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
              disabled={isPending}
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

export default LoginHeroSection;
