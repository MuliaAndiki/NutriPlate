import { cookies } from "next/headers";
import { APP_SESSION_COOKIE_KEY } from "@/configs/cookies.config";

export async function authValidator(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(APP_SESSION_COOKIE_KEY);
  return Boolean(session && session.value);
}
