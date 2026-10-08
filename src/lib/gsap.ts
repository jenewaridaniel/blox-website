"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  MotionPathPlugin,
  DrawSVGPlugin,
);

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  Flip,
  Draggable,
  MotionPathPlugin,
  DrawSVGPlugin,
};
