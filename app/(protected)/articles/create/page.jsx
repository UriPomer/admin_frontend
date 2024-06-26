"use client";
import React, { useState, useEffect, useRef } from "react";
import FloatingInput from "@/components/floatingInput";
import { useRouter } from "next/navigation";
import UploadFileZone from "@/components/uploadFileZone";
import TextInput from "@/components/textInput";
import { Button } from "flowbite-react";
import Swal from "sweetalert2";
import { Editor } from '@tinymce/tinymce-react';

export default function CreateArticlePage() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const [token, setToken] = useState("");
  const [org_id, setOrgId] = useState("");
  const [image_url, setImageUrl] = useState("http://dummyimage.com/720x300");

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const org_id = localStorage.getItem("org_id");

    if (token) {
      setToken(token);
    }
    if (org_id) {
      setOrgId(org_id);
    }
  }, []);

  const CreateArticle = async () => {
    if(editorRef.current === null) {
      Swal.fire({
        title: "页面出了点错误",
        icon: "error",
        showConfirmButton: true,
      });
      return;
    }
    console.log(editorRef.current.getContent());
    const res = await fetch(`${process.env.API_ROUTE_PREFIX}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ("Bearer " + token),
      },
      body: JSON.stringify({
        title: title,
        desc: description,
        content: editorRef.current.getContent(),
        org_id: org_id,
        image_url: image_url,
      }),
    }).then(() => {
      Swal.fire({
        title: "创建成功",
        icon: "success",
        showConfirmButton: true,
      });
      router.push("/articles");
    });
  };

  return (
    <div className="main">
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
      <Editor
        apiKey='sy14qey9ahvtidwvsdl5quzc80jorcmrx6nbr9oq5v5cb9e5'
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
        init={{
          selector: "textarea", // change this value according to your HTML
          toolbar: "paste",
          paste_remove_styles_if_webkit: false,
          paste_webkit_styles: "all",

          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "importcss",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
        <Button onClick={log} style={{ margin: "20px auto" }}>
          控制台输出内容
        </Button>
        <Button style={{ margin: "1em 0em" }} onClick={() => CreateArticle()}>
        <span>提交</span>
      </Button>
      {/* <FileZone /> */}
    </div>
  );
}
