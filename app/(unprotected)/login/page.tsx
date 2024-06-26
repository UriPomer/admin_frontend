"use client";

import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "./login.css";
import crypto from "crypto";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const hashPassword = (password: string) => {
    const sha256 = crypto.createHash("sha256");
    sha256.update(password);
    return sha256.digest("hex");
  };

  const checkAuth = async () => {
    const apiRoutePrefix = process.env.API_ROUTE_PREFIX;
    const fetchStr = apiRoutePrefix + `/users` + `/login`;

    const password = hashPassword(formData.password);

    const response = await fetch(fetchStr, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.username,
        password: password,
      }),
    });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "登录成功",
        showConfirmButton: false,
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "登录失败",
        text: "用户名或密码错误",
      });
    }
  };

  return (
    <Card className="login">
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username1" value="用户名" />
          </div>
          <TextInput
            id="username1"
            type="username"
            name="username"
            placeholder="username"
            required
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="密码" />
          </div>
          <TextInput
            id="password1"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">记住我</Label>
        </div>
        <Button onClick={() => checkAuth()}>登录</Button>
      </form>
    </Card>
  );
}
