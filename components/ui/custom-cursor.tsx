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
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            
            const target = e.target as HTMLElement
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null
            )
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        window.addEventListener('mousemove', moveCursor)
        document.body.addEventListener('mouseenter', handleMouseEnter)
        document.body.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            document.body.removeEventListener('mouseenter', handleMouseEnter)
            document.body.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [cursorX, cursorY])

    if (typeof window === 'undefined') return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block">
            {/* Main Dot */}
            <motion.div
                className="fixed w-3 h-3 bg-[#adff2f] rounded-full"
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
                className="fixed w-10 h-10 border-2 border-[#adff2f] rounded-full"
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    backgroundColor: isPointer ? 'rgba(173, 255, 47, 0.2)' : 'rgba(173, 255, 47, 0)',
                }}
                style={{
                    x: edgeX,
                    y: edgeY,
                    translateX: '-50%',
                    translateY: '-50%',
                    opacity: isVisible ? 0.5 : 0,
                }}
            />
        </div>
    )
}
