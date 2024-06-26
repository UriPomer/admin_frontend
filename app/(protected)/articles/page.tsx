"use client";

import React, { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

interface Article {
  id: string;
  title: string;
  desc: string;
  content_url: string;
  image_url: string;
  org_id: string;
}

export default function Articles() {
  const [articles, setArticles] = useState([] as Article[]);
  const [isEditing, setIsEditing] = useState(false);
  const [articlesToDelete, setArticlesToDelete] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getArticleList = async () => {
      const token = localStorage.getItem("token") as string;
      //获取组织id
      const org_id = localStorage.getItem("org_id") as string;

      const res = await fetch(
        `${process.env.API_ROUTE_PREFIX}/orgs/${org_id}/articles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      setArticles(data);
    };
    getArticleList().then();
  }, []);

  const RenderArticleList = () => {
    const handleDelete = (articleId: string) => {
      if (isEditing) {
        setArticlesToDelete([...articlesToDelete, articleId]);
      }
      const token = localStorage.getItem("token") as string;
      const response = fetch(
        `${process.env.API_ROUTE_PREFIX}/articles/${articleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: ("Bearer " + token) as string,
          },
        }
      );
    };
    if (!articles) return null;
    const filteredArticles = articles.filter(
      (article) => !articlesToDelete.includes(article.id)
    );

    return (
      <div className={styles.cardGroup}>
        {filteredArticles.map((article) => (
          <div key={article.id}>
            {isEditing && (
              <Button
                className="delete-button"
                onClick={() => handleDelete(article.id)}
              >
                删除
              </Button>
            )}
            <Link href={`/articles/${article.id}`}>
              <Card
                className="max-w-sm margin-20"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc={article.image_url}
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {article.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {article.desc}
                </p>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="main">
      <Button.Group
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Button
          color="gray"
          onClick={() => {
            router.push("/articles/create");
          }}
        >
          创建文章
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "退出编辑" : "管理文章"}
        </Button>
      </Button.Group>
      {RenderArticleList()}
    </div>
  );
}
