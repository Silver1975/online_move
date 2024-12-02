import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AuthForm from "../components/AuthForm"; // Import your AuthForm component

export default function AuthCheck() {
  const authCookie = cookies().get(".AspNetCore.Application.Id");
console.log("Token^ ",authCookie )
  // Check if the cookie is present
  if (!authCookie) {
    // Render the AuthForm with `isLogin={true}` to indicate the user is authenticated
    return <AuthForm isLogin={true} />;
  } else {
    // Redirect to the profile page if the user is authenticated
    redirect("/profile");
  }
}
   
  
