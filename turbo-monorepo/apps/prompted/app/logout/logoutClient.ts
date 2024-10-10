import { signout } from "./actions";

export async function handleLogout() {
  try {
    await signout();
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
