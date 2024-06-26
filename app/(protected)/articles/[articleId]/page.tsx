"use client";

import { Blockquote, Button, Spinner } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  const [id, setId] = useState(params.articleId as string);
  const [article, setArticle] = useState<Article | null>(null);
  const [content, setContent] = useState("");

  useEffect(() => {
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
      //将content_url转换为content
      fetch(`${data.content_url}`).then((res) => {
        res.text().then((text) => {
          setContent(text);
        });
      });

      setArticle(data);
    };
    showArticle();
  }, [id]);

  return (
    <div className="main">
      {article ? (
        <div>
          <div className="border-double border-4 border-gray-600 m-7"></div>
          <p className="text-4xl text-gray-900 dark:text-white m-7">
            {article.title}
          </p>
          <Blockquote className="m-7">
            <p>{article.desc}</p>
          </Blockquote>
          <div
            className="border-double border-4 border-gray-600 mt-7"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <Button
            gradientDuoTone="purpleToBlue"
            className="mt-7"
            style={{
              margin: "2rem auto",
            }}
            onClick={() => {
              router.push(`/articles/${id}/edit`);
            }}
          >
            更新文章
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
