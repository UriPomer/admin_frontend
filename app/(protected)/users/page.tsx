"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Table, TextInput, Spinner, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
interface User {
  user_id: string;
  username: string;
  role: string;
}

export default function Users() {
  const router = useRouter();
  const [users, setUsers] = useState([] as User[]);
  const [usersToDelete, setUsersToDelete] = useState([] as User[]);
  const [usersToAdd, setUsersToAdd] = useState([] as User[]);
  const [usernameToAdd, setUsernameToAdd] = useState("");

  const handleEditUser = (user: any) => {
    if (user.user_id === localStorage.getItem("user_id")) {
      Swal.fire({
        title: "你不能编辑自己的权限",
        icon: "error",
        showConfirmButton: true,
      });
      return;
    }
    Swal.fire({
      title: "编辑用户",
      text: "选择一个操作",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "编辑用户权限",
      cancelButtonText: "删除用户",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "编辑用户权限",
          text: "选择一个权限",
          input: "select",
          inputOptions: {
            ADMIN: "ADMIN",
            EDITOR: "EDITOR",
            MEMBER: "MEMBER",
          },
          inputPlaceholder: "选择一个权限",
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }).then((result) => {
          if (result.isConfirmed) {
            const org_id = localStorage.getItem("org_id") as string;
            fetch(
              `${process.env.API_ROUTE_PREFIX}/orgs/${org_id}/users/${user.user_id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  role: result.value,
                }),
              }
            ).then((res) => {
              if (!(res.status === 200 || res.status === 201)) {
                Swal.fire({
                  title: "编辑用户权限失败",
                  icon: "error",
                  showConfirmButton: true,
                });
                return;
              }
              Swal.fire("编辑成功!", "", "success");
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        handleDeleteUser(user);
      }
    });
  };

  const handleDeleteUser = (user: any) => {
    const org_id = localStorage.getItem("org_id") as string;
    Swal.fire({
      title: "删除用户",
      text: "你确定要删除这个用户吗？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "是的，删除",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `${process.env.API_ROUTE_PREFIX}/orgs/${org_id}/users/${user.user_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((res) => {
          if (!(res.status === 200 || res.status === 201)) {
            Swal.fire({
              title: "删除用户失败",
              icon: "error",
              showConfirmButton: true,
            });
            return;
          }
          Swal.fire("删除成功!", "", "success");
          const deletedUsers = [...usersToDelete, user];
          setUsersToDelete(deletedUsers);
        });
      }
    });
  };

  const RenderUserList = () => {
    if (users.length === 0) {
      return (
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              暂无用户
            </Table.Cell>
            <Table.Cell>暂无用户</Table.Cell>
            <Table.Cell>暂无用户</Table.Cell>
          </Table.Row>
        </Table.Body>
      );
    }
    if (typeof users !== "string" && users.length > 0) {
      const filteredUsers = users.filter((user) => {
        return !(usersToDelete.includes(user) || user.username === "");
      });
      filteredUsers.push(...usersToAdd);

      return (
        <Table.Body className="divide-y">
          {filteredUsers.map((user, index) => {
            return (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.username}
                </Table.Cell>
                <Table.Cell>{user.role}</Table.Cell>
                <Table.Cell>
                  <a
                    onClick={() => handleEditUser(user)}
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      );
    }
  };

  const handleAddUser = async () => {
    fetch(
      `${process.env.API_ROUTE_PREFIX}/users/search?username=${usernameToAdd}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((res) => {
      if (!(res.status === 200 || res.status === 201)) {
        Swal.fire({
          title: "没有找到用户",
          icon: "error",
          showConfirmButton: true,
        });
        router.push("/users");
        return;
      }
      const data = res.json().then((data) => {
        if (data.length === 0) {
          Swal.fire({
            title: "用户不存在",
            icon: "error",
            showConfirmButton: true,
          });
          return;
        }

        const userToAdd = {
          user_id: data.id,
          username: data.username,
          role: "MEMBER",
        };

        fetch(
          `${process.env.API_ROUTE_PREFIX}/orgs/${localStorage.getItem(
            "org_id"
          )}/users/${data.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              role: "MEMBER",
            }),
          }
        ).then((res) => {
          if (!(res.status === 200 || res.status === 201)) {
            Swal.fire({
              title: "添加用户失败",
              icon: "error",
              showConfirmButton: true,
            });
            return;
          }
          Swal.fire("添加成功!", "", "success");
          const newUsersToAdd = [...usersToAdd, userToAdd];
          setUsersToAdd(newUsersToAdd);
        });

        setUsernameToAdd("");
        router.push("/users");
      });
    });
  };

  useEffect(() => {
    const getUsers = async () => {
      const token = localStorage.getItem("token") as string;
      const org_id = localStorage.getItem("org_id") as string;

      const res = await fetch(
        `${process.env.API_ROUTE_PREFIX}/orgs/${org_id}/roles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => {
        if (!(res.status === 200 || res.status === 201)) {
          Swal.fire({
            title: "获取用户列表失败",
            icon: "error",
            showConfirmButton: true,
          });
          router.push("/");
        }
        const data = res.json().then((data) => {
          setUsers(data);
        });
      });
    };
    getUsers();
  }, [router]);

  return (
    <div className="main">
      {users ? (
        <div>
          <div className="flex" style={{ justifyContent: "center" }}>
            <TextInput
              placeholder="在这里输入要添加的用户名"
              value={usernameToAdd}
              onChange={(e: any) => setUsernameToAdd(e.target.value)}
            />

            <Button
              onClick={() => {
                handleAddUser();
              }}
              color="blue"
            >
              添加用户
            </Button>
          </div>
          <Table hoverable className="mt-5">
            <Table.Head>
              <Table.HeadCell>用户名</Table.HeadCell>
              <Table.HeadCell>用户权限</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <RenderUserList />
          </Table>
        </div>
      ) : (
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      )}
    </div>
  );
}
