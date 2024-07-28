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
      <SectionContainer className="relative pb-24 sm:pb-32 lg:pt-5 xl:pt-2 lg:pb-52">
        <div className="px-6 lg:px-0 lg:pt-4">
          <div className="relative mx-auto text-center flex flex-col items-center">
            <h1 className="relative leading-snug w-3/4 tracking-tight text-balance mt-16 font-bold text-gray-900 text-5xl md:text-6xl">
              Uncover Insights <br /> from Your{" "}
              <FlipWords words={flipWords} className="text-blue-600" />.
            </h1>
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
