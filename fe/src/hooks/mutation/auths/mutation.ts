import {
  APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  APP_SESSION_COOKIE_KEY,
} from "@/configs/cookies.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { logout, setCurrentUser } from "@/stores/authSlice/authSlice";
import { setEmail, setPhone } from "@/stores/otpSlice/otpSlice";
import { userSchema } from "@/types/api";
import { FormLogin, FormRegister } from "@/types/form/auth.form";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next";
class useAuthMutation {
  public useLogin() {
    const nameSpace = useAppNameSpace();
    return useMutation<TResponse<any>, Error, FormLogin>({
      mutationFn: (payload) => Api.Auth.login(payload),
      onSuccess: (res) => {
        const token = res.data.token;
        setCookie(APP_SESSION_COOKIE_KEY, token, {
          maxAge: APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
          path: "/",
        });
        console.log("payload", token);
        const payload: userSchema = {
          user: res.data,
        };

        nameSpace.dispatch(setCurrentUser(payload));
        nameSpace.alert.toast({
          title: "succesfully",
          message: "success login in NutriPlate",
          icon: "success",
        });
      },
      onError: (err) => {
        console.error(err);
        nameSpace.alert.toast({
          title: "failed",
          message: "failed login in NutriPlate",
          icon: "error",
        });
      },
    });
  }
  public useLogout() {
    const nameSpace = useAppNameSpace();
    return useMutation<TResponse<any>, Error, any>({
      mutationFn: () => Api.Auth.logout(),
      onSuccess: () => {
        nameSpace.alert.toast({
          title: "succesfully",
          message: "success logout in NutriPlate",
          icon: "success",
          onVoid: () => {
            nameSpace.queryClient.clear();
            nameSpace.dispatch(logout());
            deleteCookie(APP_SESSION_COOKIE_KEY);
          },
        });
        nameSpace.router.push("/login");
      },
      onError: (err) => {
        console.error(err);
        nameSpace.alert.toast({
          title: "failed",
          message: "server internal error",
          icon: "warning",
          onVoid: () => {
            nameSpace.queryClient.clear();
            nameSpace.dispatch(logout());
            deleteCookie(APP_SESSION_COOKIE_KEY);
          },
        });
        nameSpace.router.push("/login");
      },
    });
  }
  public useRegister() {
    const nameSpace = useAppNameSpace();
    return useMutation<TResponse<any>, Error, FormRegister>({
      mutationFn: (payload) => Api.Auth.register(payload),
      onSuccess: (res) => {
        nameSpace.alert.toast({
          title: "success",
          message: "succesfully registerd",
          icon: "success",
        });

        if (res.data.email !== null) {
          nameSpace.dispatch(setEmail(res.data.email));
          nameSpace.router.push("/verify-otp");
        } else {
          nameSpace.dispatch(setPhone(res.data.phone));
          nameSpace.router.push("/login");
        }
      },
      onError: (err) => {
        console.error(err);
        nameSpace.alert.toast({
          title: "failed",
          message: "failed registerd",
          icon: "error",
        });
      },
    });
  }
}
export default useAuthMutation;
