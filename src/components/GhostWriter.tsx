import { motion } from 'framer-motion';

interface GhostWriterProps {
  text: string;
  className?: string;
  speed?: number;
}

export const GhostWriter = ({ text, className, speed = 0.015 }: GhostWriterProps) => {
  return (
    <motion.div 
      className={`inline leading-relaxed ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${text}-${i}`}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
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
