import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-primary">
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: "rgb(44,44,56)",
          colorBackground: "#2c384a",
          colorText: "white",
          colorInputBackground: "#43536b",
          colorAlphaShade: "white",
        },
      }}
    />
  </div>
);

export default SignInPage;
