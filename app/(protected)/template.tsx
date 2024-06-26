"use client";
import SidebarComponent from "@/components/sidebar";
import { checkAuthentication } from "@/scripts/authUtils";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

interface Org {
  id: string;
  name: string;
  desc: string;
  icon_url: string;
  type: string;
}

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  const [org, setOrg] = useState<Org>();
  const [user, setUser] = useState<User>();

  const mainPage = (isLogin: boolean) => {
    if (!isLogin) {
      try {
        Swal.fire({
          title: "未登录",
          text: "请先登录",
          icon: "warning",
          confirmButtonText: "确定",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
          if (result.isDismissed) {
            router.push("/login");
          }
        });
      } catch (error) {
        console.error("Swal.fire 异常:", error);
      }
      return <div></div>;
    } else {
      return (
        <div>
          {RenderBreadcrumb()}
          {children}
        </div>
      );
    }
  };

  const RenderBreadcrumb = () => {
    const path = usePathname();
    const pathArray = path.split("/");
    let pathLink = "";

    if (pathArray[1] === "") {
      return (
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item href="#" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          {pathArray.map((item, index, array) => {
            if (item === "") {
            } else {
              pathLink = pathLink + "/" + item;
              const isLastElement = index === array.length - 1;

              // 根据isLastElement设置不同的href
              const href = isLastElement ? "#" : pathLink;
              return (
                <Breadcrumb.Item href={href} key={index}>
                  {item}
                </Breadcrumb.Item>
              );
            }
          })}
        </Breadcrumb>
      );
    } else {
      return (
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item href="/" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          {pathArray.map((item, index, array) => {
            if (item === "") {
            } else {
              pathLink = pathLink + "/" + item;
              const isLastElement = index === array.length - 1;

              // 根据isLastElement设置不同的href
              const href = isLastElement ? "#" : pathLink;
              return (
                <Breadcrumb.Item href={href} key={index}>
                  {item}
                </Breadcrumb.Item>
              );
            }
          })}
        </Breadcrumb>
      );
    }
  };

  const ToggleTheme = () => {
    const body = document.querySelector("body");
    if (body) {
      if (body.classList.contains("light")) {
        body.classList.remove("light");
        body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        body.classList.remove("dark");
        body.classList.add("light");
        localStorage.setItem("theme", "light");
      }
    }
  };

  const FireSwal = () => {
    try {
      Swal.fire({
        title: "未登录",
        text: "请先登录",
        icon: "warning",
        confirmButtonText: "确定",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
        if (result.isDismissed) {
          router.push("/login");
        }
      });
    } catch (error) {
      console.error("Swal.fire 异常:", error);
    }
    return <div></div>;
  };

  useEffect(() => {
    const checkLogin = async () => {
      const isLoginTemp = await checkAuthentication();
      setIsLogin(isLoginTemp);
    };
    checkLogin();
    //设置主题
    const theme = localStorage.getItem("theme");
    setTheme(theme as string);
    const body = document.querySelector("body");
    if (body) {
      if (theme === "dark") {
        body.classList.remove("light");
        body.classList.add("dark");
      } else {
        body.classList.remove("dark");
        body.classList.add("light");
      }
    }

    const user_id = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    setUser({
      id: user_id as string,
      username: username as string,
      avatar_url: "",
    });

    const orgname = localStorage.getItem("org_name");
    const org_id = localStorage.getItem("org_id");
    const org_desc = localStorage.getItem("org_desc");
    const org_icon_url = localStorage.getItem("org_icon_url");
    const org_type = localStorage.getItem("org_type");
    setOrg({
      id: org_id as string,
      name: orgname as string,
      desc: org_desc as string,
      icon_url: org_icon_url as string,
      type: org_type as string,
    });
  }, []);

  return (
    <div>
      {isLogin ? (
        <Flowbite>
          <div className="container">
            <div className="sidebar">
              <SidebarComponent
                username={user?.username as string}
                orgname={org?.name as string}
                imgUrl={user?.avatar_url as string}
              />
            </div>
            <div className="right">{mainPage(isLogin)}</div>
          </div>

          <div
            style={{
              position: "fixed",
              insetBlockEnd: "2em",
              insetInlineStart: "1em",
            }}
          >
            <DarkThemeToggle onClick={() => ToggleTheme()} />
          </div>
        </Flowbite>
      ) : (
        <div>
          <div>未登录</div>
          <div>{FireSwal()}</div>
        </div>
      )}
    </div>
  );
}
