import Card from "@/components/Card"
import Pagination from "@/components/Pagination"

import Newsletter from "@/components/Newsletter";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import Image from 'next/image';
import { posts } from "@/data/posts";
import { type Posts } from "@/type";

export default function Home() {

  return (
    <>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900">
        <div className="flex flex-col justify-between px-4 mx-auto max-w-screen-xl">

          <article className="mx-auto w-full max-w-3xl prose lg:prose-xl prose-stone dark:prose-invert">



            <header className="mb-4 lg:mb-6 not-format">

              {/* <address className="flex items-center mb-6 not-italic">

                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">


     
                  <div className="text-base w-1 h-1 rounded-full bg-black dark:bg-white mx-1"></div>


                </div>

              </address> */}

            </header>
            <figure className="text-center">
              <Image
                className="mx-small"
                src="https://i.ibb.co/4scDwYt/Fast-Prompt-logo.png"
                alt="fast prompt"
                width={500}   // Adjusted width
                height={162}  // Adjusted height
              />
            </figure>



          </article>
        </div>
      </main>

    </>
  )

}
