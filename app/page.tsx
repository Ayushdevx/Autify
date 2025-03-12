"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";
import { MainContent } from "@/components/main-content";

export default function Home() {
  return (
    <div className="h-screen bg-background flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 border-r border-border"
        >
          <Sidebar />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 overflow-y-auto"
        >
          <MainContent />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="h-24 border-t border-border"
      >
        <Player />
      </motion.div>
    </div>
  );
}