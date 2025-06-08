import React from 'react'
import Link from "next/link"
import { motion } from "framer-motion" // Import motion

const footerFadeInUpVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

export default function Footer() {
  return (
    <motion.footer
      className="bg-background border-t border-border py-8"
      variants={footerFadeInUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of footer is visible
    >
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Products</h3>
          <ul className="space-y-2">
            {["Exchange", "Wallet", "Card", "Earn"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
          <ul className="space-y-2">
            {["About", "Careers", "Press", "Blog"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
          <ul className="space-y-2">
            {["Help Center", "Contact Us", "API Documentation", "Fees"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Risk Disclosure"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          © 2024 Web3Crypto.ai   All rights reserved.
        </p>
      </div>
    </div>
    </motion.footer>
  )
}
