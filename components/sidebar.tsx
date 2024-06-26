"use client";

import { Badge, Sidebar, Avatar } from "flowbite-react";
import {
  HiChartPie,
  HiShoppingBag,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";

function SidebarComponent({
  username,
  orgname,
  imgUrl,
}: {
  username: string;
  orgname: string;
  imgUrl: string;
}) {
  return (
    <Sidebar aria-label="Sidebar with call to action button example">
      <div style={{ padding: "10px", margin: "10px 0px" }}>
        <Avatar img={imgUrl} rounded>
          <div className="space-y-1 font-medium dark:text-white">
            <div>{username}</div>
            <div>{orgname}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">beta</div>
          </div>
        </Avatar>
      </div>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            流量总览（开发中）
          </Sidebar.Item>
          <Sidebar.Item href="/articles" icon={HiViewBoards}>
            管理组织文章
          </Sidebar.Item>
          <Sidebar.Item href="/users" icon={HiUser}>
            管理组织成员
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            社团文创（开发中）
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
      <Sidebar.CTA>
        <div className="mb-3 flex items-center">
          <Badge color="warning">测试版</Badge>
        </div>
        <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400"></div>
        <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
          这是一个测试版，如果您在使用过程中遇到任何问题，请联系我们。
        </div>
      </Sidebar.CTA>
    </Sidebar>
  );
}

export default SidebarComponent;
