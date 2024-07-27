import React from "react";
import SectionContainer from "@/components/SectionContainer";
import RoomContainer from "@/components/RoomContainer";
import { Star } from "lucide-react";
import { redis } from "@/lib/redis";
import { FlipWords } from "@/components/ui/flip-words";

export default async function Home() {
  const servedRequests = await redis.get("served-requests");
  const flipWords = ["innovative", "engaging", "insightful", "powerful"];

  return (
    <section className="min-h-screen">
      <SectionContainer className="relative pb-24 sm:pb-32 lg:pt-5 xl:pt-2 lg:pb-52">
        <div className="absolute inset-0 top-8">
          <div className="h-full w-full dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          </div>
        </div>
        <div className="px-6 lg:px-0 lg:pt-4">
          <div className="relative mx-auto text-center flex flex-col items-center">
            <h1 className="relative leading-snug w-3/4 tracking-tight text-balance mt-16 font-bold text-gray-900 text-5xl md:text-6xl">
              Share Your Thoughts with Us!
            </h1>

            <div className="mt-8 text-2xl font-semibold text-neutral-600 dark:text-neutral-400">
              Create <FlipWords words={flipWords} /> feedback in real-time
            </div>

            <RoomContainer />

            <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="flex flex-col gap-1 justify-between items-center sm:items-start">
                <div className="flex w-full gap-0.5 items-center justify-center">
                  <Star className="h-4 w-4 text-green-600 fill-green-600" />
                  <Star className="h-4 w-4 text-green-600 fill-green-600" />
                  <Star className="h-4 w-4 text-green-600 fill-green-600" />
                  <Star className="h-4 w-4 text-green-600 fill-green-600" />
                  <Star className="h-4 w-4 text-green-600 fill-green-600" />
                </div>
                <p>
                  <span className="font-semibold">
                    {Math.ceil(Number(servedRequests) / 10) * 10}
                  </span>{" "}
                  served requests
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
