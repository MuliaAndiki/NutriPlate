import {
  useForgotPasswsord,
  useLogin,
  useLogout,
  useRegister,
  useResend,
  useResetPassword,
  useVerify,
} from "./state/mutation";

export function useAuth() {
  return {
    mutation: {
      login: useLogin,
      register: useRegister,
      forgotPassword: useForgotPasswsord,
      logout: useLogout,
      resend: useResend,
      resetPassword: useResetPassword,
      verifyOtp: useVerify,
    },
    query: {
      //
    },
  };
}
