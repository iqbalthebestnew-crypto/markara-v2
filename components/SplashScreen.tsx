"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const shown = sessionStorage.getItem("markara-splash");
    if (shown) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem("markara-splash", "1");
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: .7 }}
        >
          <motion.div
            initial={{ opacity: 0, letterSpacing: ".7em" }}
            animate={{ opacity: 1, letterSpacing: ".22em" }}
            transition={{ duration: 1.5 }}
            className="splash-title"
          >
            MARKARA
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            DESIGN THAT LEAVES A MARK
          </motion.p>
          <motion.span
            className="line"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 2, duration: 2 }}
          />
          <style jsx>{`
            .splash {
              position: fixed;
              inset: 0;
              z-index: 999;
              background: #070707;
              display: grid;
              place-content: center;
              text-align: center;
            }
            .splash-title {
              font: 800 clamp(2.4rem, 8vw, 6rem) Manrope, sans-serif;
              color: var(--gold-light);
            }
            p {
              color: #888;
              font-size: .72rem;
              letter-spacing: .25em;
            }
            .line {
              width: min(340px, 70vw);
              height: 1px;
              margin-top: 24px;
              background: var(--gold);
              transform-origin: left;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
