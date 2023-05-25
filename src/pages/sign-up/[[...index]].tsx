import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-primary">
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
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

export default SignUpPage;
