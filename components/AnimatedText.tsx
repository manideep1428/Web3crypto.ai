"use client";

import { motion } from "framer-motion";

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <motion.div variants={sentence} initial="hidden" animate="visible" className={className}>
      {text.split(" ").map((word, index) => (
        <motion.span key={word + "-" + index} variants={letter} className="inline-block">
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
