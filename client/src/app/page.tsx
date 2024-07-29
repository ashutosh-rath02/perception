import React from "react";
import SectionContainer from "@/components/SectionContainer";
import RoomContainer from "@/components/RoomContainer";
import { Star } from "lucide-react";
import { redis } from "@/lib/redis";
import { FlipWords } from "@/components/ui/flip-words";

export default async function Home() {
  const servedRequests = await redis.get("served-requests");
  const flipWords = ["Events", "Workshops", "Conferences", "Gatherings"];

  return (
    <section className="min-h-screen">
      <SectionContainer className="relative pb-16 sm:pb-24 lg:pb-32 pt-8 lg:pt-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto text-center flex flex-col items-center">
            <h1 className="relative leading-tight w-full sm:w-3/4 tracking-tight text-balance mt-8 sm:mt-16 font-bold text-gray-900 text-4xl sm:text-5xl md:text-6xl">
              Uncover Insights <br className="hidden sm:inline" /> from Your{" "}
              <FlipWords words={flipWords} className="text-blue-600" />.
            </h1>
            <RoomContainer />

            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
              <div className="flex flex-col gap-1 justify-between items-center sm:items-start">
                <div className="flex w-full gap-0.5 items-center justify-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-4 w-4 text-green-600 fill-green-600"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base">
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
