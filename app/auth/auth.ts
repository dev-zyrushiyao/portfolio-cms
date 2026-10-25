import supabase from "../services/supabase";

//Google Authentication (OAuth) https://console.cloud.google.com/
//set up supabase in your VS code project
//create project - project name as Portfolio CMS; organization and parent-organization set to 'No organization'
//copy client id and secret from google cloud -> paste it to supabase/<database>/authenticattion/Sign-in Providers/Google/ -> enable sign in with google and paste the client ID and Client Secret
//go to Project(Portfolio CMS) -> API And services -> Oath Concent Screen
//support email / contact - <email>
//create folder auth and auth.ts inside and use this code
//create auth/callback folder and create page.tsx
//after creating account and registered the default account. to prevent other people from trying to register/login go to supabase/database/authentication/sign in providers/ -> Allow new users to sign up

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
