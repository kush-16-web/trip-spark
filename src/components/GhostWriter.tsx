import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface GhostWriterProps {
  text: string;
  className?: string;
  speed?: number;
}

export const GhostWriter = ({ text, className, speed = 0.015 }: GhostWriterProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldAnimate(true);
    }
  }, [isInView]);

  return (
    <motion.div 
      ref={ref}
      className={`inline leading-relaxed ${className}`}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.05,
            delay: i * speed,
            ease: "easeIn"
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};
