import { ArrowRight } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

function Hero() {
  return (
    <section className="bg-[black] h-[95vh]">
      <div className="flex items-baseline  justify-center pt-20 ">
        <h2
          className="text-white border flex items-center justify-center gap-[10px] py-[5px] px-[8px] rounded-full bg-[#253b4d]
        text-center border-white text-[10px]"
        >
          See What{"`"}s New <b>|</b>
          <span className="text-sky-300">AI Diagram</span>
        </h2>
      </div>
      <div className="mx-auto  px-4 py-12 lg:flex  ">
        <div className="mx-auto max-w-xl text-center ">
          <h1 className="text-4xl text-sky-300 font-extrabold sm:text-5xl flex flex-col">
            Documents & diagrams
            <strong className="font-extrabold text-white sm:block">
              for engineering teams.
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed text-slate-200">
            All-in-one markdown editor, collaborative canvas, and
            diagram-as-code builder
          </p>

          <a href="#">
            <Button variant={"secondary"} className="w-[160px] mt-[15px]">
              Try Eraser
              <ArrowRight className="w-[20px]" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
