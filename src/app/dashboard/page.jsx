"use client";

import GameForm from "@/components/Form/GameForm";
import React from "react";

const content = {
  title: "Create Game",
  buttonText: "Create",
};

const page = () => {
  return (
    <div>
      <GameForm content={content} />
    </div>
  );
};

export default page;
