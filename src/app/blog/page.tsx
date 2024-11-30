"use client";
import BlogCard from '@/components/BlogCard';
import { useEffect, useState } from 'react';
import "../../styles/enigma-font.css";

interface Post {
  title: string;
  coverImage: {
    url: string;
  };
  slug: string;
  content: {
    html: string;
  };
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const truncateContent = (html: string, wordLimit: number) => {
    const plainText = html.replace(/<[^>]+>/g, "");
    const words = plainText.split(/\s+/);
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setPosts(data);
        setTotalPages(Math.ceil(data.length / limit));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

  return (
    <div className="bg-black text-white font-enigma">
      <h1 className="text-white font-semibold font-enigma text-4xl text-center md:text-5xl lg:text-7xl pb-10 pt-5">BLOGS</h1>
      <div className="text-black">
        <div className="grid gap-8 p-5 rounded-lg">
          {paginatedPosts.map((post, index) => (
            <BlogCard
              key={index}
              title={post.title}
              description={truncateContent(post.content.html, 20)}
              image={post.coverImage.url}
              slug={post.slug}
            />
          ))}
        </div>
        <div className="flex justify-end items-center space-x-4 mt-6 mr-10">
          <button
            onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
            className="px-4 py-2 bg-slate-50 rounded text-black opacity-75"
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-white">{`Page ${page} of ${totalPages}`}</span>
          <button
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            className="px-4 py-2 bg-slate-50 rounded text-black opacity-75"
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
