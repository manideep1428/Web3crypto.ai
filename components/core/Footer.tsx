import React from 'react'
import { motion } from  "framer-motion"
import Link from "next/link"

export default function Footer() {
  return (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1, duration: 0.5 }}
    className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800"
  >
    <p className="text-xs text-gray-500 dark:text-gray-400">
      © 2024 WebCrypto.ai. All rights reserved.
    </p>
    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
      <Link className="text-xs hover:underline underline-offset-4" href="#">
        Terms of Service
      </Link>
      <Link className="text-xs hover:underline underline-offset-4" href="#">
        Privacy
      </Link>
    </nav>
  </motion.footer>
  )
}
