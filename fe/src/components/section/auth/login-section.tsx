import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { FormLogin } from "@/types/form/auth.form";
import Link from "next/link";

interface LoginSectionProps {
  formLogin: FormLogin;
  setFormLogin: React.Dispatch<React.SetStateAction<FormLogin>>;
  isPending: boolean;
  onLogin: () => void;
}
const LoginHeroSection: React.FC<LoginSectionProps> = ({
  formLogin,
  isPending,
  onLogin,
  setFormLogin,
}) => {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <div className="w-full min-h-screen flex justify-center items-center  flex-col ">
        <h1 className="text-4xl font-bold">Masuk</h1>
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
          <div className="w-full max-w-sm border">
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
        </form>
      </div>
    </div>
  );
};

export default LoginHeroSection;
