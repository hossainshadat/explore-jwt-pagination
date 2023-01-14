import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (value) => {
    fetch("http://localhost:5000/login", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} />
        <input {...register("password", { required: true })} />

        <input type="submit" />
      </form>
    </div>
  );
};

export default Login;
