import { useMutation } from "@tanstack/react-query";
import { deleteCookie, setCookie } from "cookies-next";

import {
  APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  APP_SESSION_COOKIE_KEY,
} from "@/configs/cookies.config";
import { useAppNameSpace } from "@/hooks/useAppNameSpace";
import { TResponse } from "@/pkg/react-query/mutation-wrapper.type";
import Api from "@/services/props.module";
import { logout, setCurrentUser } from "@/stores/authSlice/authSlice";
import {
  clearOtp,
  setEmail,
  setPhone,
  setSoure,
} from "@/stores/otpSlice/otpSlice";
import { userSchema } from "@/types/api";
import {
  FormLogin,
  FormRegister,
  FormResetPassword,
  FormSendOtp,
  FormVerify,
} from "@/types/form/auth.form";

export function useLogin() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormLogin>({
    mutationFn: (payload) => Api.Auth.login(payload),
    onSuccess: (res) => {
      const token = res.data.token;
      setCookie(APP_SESSION_COOKIE_KEY, token, {
        maxAge: APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
        path: "/",
      });

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

export function useLogout() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: () => Api.Auth.logout(),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "succesfully",
        message: "success logout in NutriPlate",
        icon: "success",
      });
      nameSpace.queryClient.clear();
      nameSpace.dispatch(logout());
      deleteCookie(APP_SESSION_COOKIE_KEY);
      nameSpace.router.push("/login");
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "server internal error",
        icon: "warning",
      });
      nameSpace.queryClient.clear();
      nameSpace.dispatch(logout());
      deleteCookie(APP_SESSION_COOKIE_KEY);
      nameSpace.router.push("/login");
    },
  });
}

export function useRegister() {
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
        nameSpace.dispatch(setSoure("Register"));
        nameSpace.router.push("/verify-otp");
      } else {
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

export function useVerify() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormVerify>({
    mutationFn: (payload) => Api.Auth.verifyOtp(payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "success",
        message: "succesfully verify Otp",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed verifyOtp",
        icon: "error",
      });
    },
  });
}

export function useResend() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormSendOtp>({
    mutationFn: (payload) => Api.Auth.resendOtp(payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "success",
        message: "succesfully resend Otp",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed resend Otp",
        icon: "error",
      });
    },
  });
}

export function useForgotPasswsord() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormResetPassword>({
    mutationFn: (payload) => Api.Auth.forgotPassword(payload),
    onSuccess: (res) => {
      nameSpace.alert.toast({
        title: "success",
        message: "succesfully identifier account",
        icon: "success",
      });
      if (res.data.email !== null) {
        nameSpace.dispatch(setEmail(res.data.email));
        nameSpace.dispatch(setSoure("Forgot-Password"));
        nameSpace.router.push("/verify-otp");
      } else {
        nameSpace.dispatch(setPhone(res.data.phone));
        nameSpace.router.push("/reset-password");
      }
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed identifier account",
        icon: "error",
      });
    },
  });
}

export function useResetPassword() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, FormResetPassword>({
    mutationFn: (payload) => Api.Auth.resetPassword(payload),
    onSuccess: () => {
      nameSpace.alert.toast({
        title: "success",
        message: "succesfully reset your password",
        icon: "success",
      });
      nameSpace.dispatch(clearOtp());
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "failed reset password",
        icon: "error",
      });
    },
  });
}

export function useLoginGoogle() {
  const nameSpace = useAppNameSpace();
  return useMutation<TResponse<any>, Error, any>({
    mutationFn: (payload) => Api.Auth.LoginGoogle(payload),
    onSuccess: (res) => {
      const token = res.data.token;
      setCookie(APP_SESSION_COOKIE_KEY, token, {
        maxAge: APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
        path: "/",
      });
      const payload: userSchema = {
        user: res.data,
      };
      nameSpace.dispatch(setCurrentUser(payload));
      nameSpace.alert.toast({
        title: "succes",
        message: "welcom to nutriplate",
        icon: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      nameSpace.alert.toast({
        title: "failed",
        message: "try again",
        icon: "error",
      });
    },
  });
}
