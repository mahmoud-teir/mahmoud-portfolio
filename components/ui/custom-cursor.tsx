'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [isPointer, setIsPointer] = useState(false)
    
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)
    
    const springConfig = { damping: 25, stiffness: 250 }
    const edgeX = useSpring(cursorX, springConfig)
    const edgeY = useSpring(cursorY, springConfig)

    useEffect(() => {
        setIsVisible(true) // Force visible on mount
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            
            const target = e.target as HTMLElement
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) ||
                target.closest('a') !== null ||
                target.closest('button') !== null
            )
        }

        window.addEventListener('mousemove', moveCursor)
        return () => window.removeEventListener('mousemove', moveCursor)
    }, [cursorX, cursorY])

    if (typeof window === 'undefined') return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[99999]">
            {/* Main Dot */}
            <motion.div
                className="fixed w-4 h-4 bg-black border-2 border-[#adff2f] rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 1 : 0,
                }}
            />
            
            {/* Outline Circle */}
            <motion.div
                className="fixed w-12 h-12 border-2 border-black rounded-full"
                animate={{
                    scale: isPointer ? 1.4 : 1,
                    borderColor: isPointer ? '#adff2f' : '#000000',
                }}
                style={{
                    x: edgeX,
                    y: edgeY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 0.3 : 0,
                }}
            />
        </div>
    )
}
