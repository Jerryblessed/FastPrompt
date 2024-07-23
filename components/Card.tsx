// components/Card.tsx
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/type"; // Ensure this matches the correct path and export

function Card({ post }: { post: Post }) {
  return (
    <div className="max-w-full m-2 sm:m-0 bg-gray-100 shadow-sm dark:bg-gray-800">
      {/* <Image className="rounded-lg p-3" width={1000} height={324} src={post.image} alt="demo image" /> */}
      <div className="p-3">
        <div className="flex mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Mar 10, 2023</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mx-1">,</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">5 min read</p>
        </div>
        <Link className="text-lg" href={`/read/${post.title.toLowerCase().trim().split(" ").join("-")}`}>
          {post.title}
        </Link>
        <div className="rounded-lg p-3" style={{ width: 1000, height: 324 }}>
          <iframe
            src={`https://player.thetavideoapi.com/video/${post.url}?autoplay=0`}
            width="100%"
            height="100%"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
