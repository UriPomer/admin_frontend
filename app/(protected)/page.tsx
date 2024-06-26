"use client";

import React, { useEffect, useState } from "react";
import { Accordion, Blockquote, Button } from "flowbite-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Org {
  id: string;
  name: string;
  desc: string;
  icon_url: string;
  type: string;
}

function Home() {
  const [org, setOrg] = useState(null as Org | null);
  const router = useRouter();

  useEffect(() => {
    const showOrg = async () => {
      const org_id = localStorage.getItem("org_id");
      const org_name = localStorage.getItem("org_name");
      const org_desc = localStorage.getItem("org_desc");
      const org_icon_url = localStorage.getItem("org_icon_url");
      const org_type = localStorage.getItem("org_type");
      const org = {
        id: org_id,
        name: org_name,
        desc: org_desc,
        icon_url: org_icon_url,
        type: org_type,
      } as Org;
      setOrg(org);
    };
    showOrg();
  }, []);

  const loginOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("org_id");
    localStorage.removeItem("org_name");
    localStorage.removeItem("org_desc");
    localStorage.removeItem("org_icon_url");
    localStorage.removeItem("org_type");
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="main">
      <div className="flex justify-evenly items-center">
        <img
          className="rounded-full w-48 h-48 margin-20"
          src={org?.icon_url}
          alt="image description"
        />
        <h3 className="text-3xl font-bold dark:text-white">
          组织名：{org?.name}
        </h3>
      </div>

      <Blockquote className="margin-20">
        <svg
          className="mb-4 h-8 w-8 text-gray-400 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 14"
        >
          <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
        </svg>
        {org ? (
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-300">
            {org.desc}
          </h4>
        ) : (
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-300">
            未登录
          </h4>
        )}
      </Blockquote>

      <Accordion>
        <Accordion.Panel>
          <Accordion.Title>
            欢迎使用我们的服务，原型阶段这个网页可以干什么？
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              这是我们的社团后台管理页面，你可以在这里管理你们组织的文章，用户，以及其他信息。
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              你现在可以在上面上传文章，这是核心功能。同时也可以查看你们组织已有的用户列表，文章列表。&nbsp;
              <Link
                href="/articles"
                target="_blank"
                className="text-cyan-600 hover:underline dark:text-cyan-500"
              >
                查看组织已有文章&nbsp;
              </Link>
              如果有任何想要反馈的地方，欢迎找我们的成员联系。
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>我该如何上传文章？</Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              当你在秀米中完成编辑时，点击“导出”，然后 ctrl + c
              复制。然后点击这个链接&nbsp;
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              <Link
                href="/articles/create"
                className="text-cyan-600 hover:underline dark:text-cyan-500"
              >
                创建文章&nbsp;
              </Link>
              粘贴刚才复制的内容，点击提交即可上传。如果想查看HTML文本，可以按F12打开控制台，点击“控制台输出内容”即可。
            </p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <Button
        color="dark"
        pill
        onClick={() => loginOut()}
        style={{ margin: "30px auto" }}
      >
        登出
      </Button>
    </div>
  );
}

export default Home;
