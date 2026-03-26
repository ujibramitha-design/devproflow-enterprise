"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, UserPlus, Landmark, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const actions = [
  { icon: Camera,   label: "Scan Document", href: "/scanner",  color: "from-emerald-500 to-emerald-600" },
  { icon: UserPlus, label: "Input Prospek", href: "/customer",  color: "from-blue-500 to-blue-600" },
  { icon: Landmark, label: "Cek Kuota Bank", href: "/dashboard/finance", color: "from-violet-500 to-violet-600" },
]

export function FloatingActionButton() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Action items */}
      <AnimatePresence>
        {open && actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => { setOpen(false); router.push(action.href) }}
            className={cn(
              "flex items-center gap-3 pl-4 pr-5 py-2.5 rounded-full shadow-lg",
              "bg-gradient-to-r text-white font-semibold text-sm",
              "hover:scale-105 active:scale-95 transition-transform",
              action.color
            )}
          >
            <action.icon className="size-4" strokeWidth={2.5} />
            <span>{action.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* FAB trigger */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "flex size-14 items-center justify-center rounded-full shadow-2xl",
          "bg-gradient-to-br from-[var(--primary)] to-[var(--ring)] text-white",
          "transition-colors duration-300",
          open && "from-rose-500 to-rose-600"
        )}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <X className="size-6" strokeWidth={2.5} /> : <Plus className="size-6" strokeWidth={2.5} />}
        </motion.div>
      </motion.button>
    </div>
  )
}
