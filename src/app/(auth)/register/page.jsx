import Signup from "@/components/Form/Signup";
import { useSignupMutation } from "@/lib/actions/authActions";
import React from "react";
import { useRouter } from "next/navigation";

const content = {
  title: "Sign up",
  buttonText: "Submit",
};
const page = () => {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (data, e) => {
    const res = await signup(data);
    console.log("res", res);
  };
  return (
    <div>
      <Signup content={content} onSubmit={onSubmit} />
    </div>
  );
};

export default page;
