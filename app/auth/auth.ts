import supabase from "../services/supabase";

//Google Authentication (OAuth)

export async function handleGoogleLogin() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    console.error("Error logging in with Google:", error);
    return;
  }

  if (data?.url) {
    // Define popup dimensions
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2 + window.screenX;
    const top = window.innerHeight / 2 - height / 2 + window.screenY;

    // Open the small window centered on the screen
    window.open(
      data.url,
      "Google Sign In",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`,
    );
  }
}
