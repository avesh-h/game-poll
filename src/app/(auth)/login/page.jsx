import React from "react";
import Signup from "@/components/Form/Signup";

const content = {
  title: "Login",
  buttonText: "Sign in",
};

const login = () => {
  return (
    <div>
      <Signup content={content} login />
    </div>
  );
};

export default login;
