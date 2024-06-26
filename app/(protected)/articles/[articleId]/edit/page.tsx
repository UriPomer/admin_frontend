"use client";

import FloatingInput from "@/components/floatingInput";
import { Button, Spinner } from "flowbite-react";
import TextInput from "@/components/textInput";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Article {
  id: string;
  title: string;
  desc: string;
  content_url: string;
  image_url: string;
  org_id: string;
}

export default function ArticleDetails() {
  const params = useParams();
  const id = params.articleId;
  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [org_id, setOrgId] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const UpdateArticle = async () => {
    const token = localStorage.getItem("token") as string;
    fetch(`${process.env.API_ROUTE_PREFIX}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        desc: description,
        content: content,
        image_url: image_url,
        org_id: org_id,
      }),
    }).then((res) => {
      if (res.status === 200) {
        Swal.fire({
          title: "更新成功",
          icon: "success",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          title: "更新失败",
          icon: "error",
          showConfirmButton: true,
        });
      }
      router.push("/articles");
    });
  };

  useEffect(() => {
    setToken(localStorage.getItem("token") as string);
    setOrgId(localStorage.getItem("org_id") as string);
    setImageUrl("http://dummyimage.com/720x300");
    if (id) {
      const showArticle = async () => {
        const token = localStorage.getItem("token") as string;
        const res = await fetch(
          `${process.env.API_ROUTE_PREFIX}/articles/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setArticle(data);
        setTitle(data.title as string);
        setDescription(data.desc as string);

        //将content_url转换为content
        fetch(`${data.content_url}`).then((res) => {
          res.text().then((text) => {
            setContent(text);
          });
        });
      };
      showArticle();
    }
  }, [id]);

  return (
    <div className="main">
      {article ? (
        <div>
          <FloatingInput
            label="标题"
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FloatingInput
            label="描述"
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextInput
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />
          <Button style={{ margin: "1em 0em" }} onClick={() => UpdateArticle()}>
            <span>提交</span>
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Spinner aria-label="Center-aligned spinner example" />
        </div>
      )}
    </div>
  );
}
