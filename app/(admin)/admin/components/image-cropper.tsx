'use client'

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, Check, RotateCcw } from 'lucide-react'

interface ImageCropperProps {
    image: string
    onCropComplete: (croppedImage: Blob) => void
    onCancel: () => void
    aspect?: number
}

export function ImageCropper({ image, onCropComplete, onCancel, aspect = 16 / 9 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const onCropChange = (crop: any) => setCrop(crop)
    const onZoomChange = (zoom: any) => setZoom(zoom)

    const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createCroppedImage = async () => {
        try {
            const canvas = document.createElement('canvas')
            const img = new Image()
            img.src = image
            
            await new Promise((resolve, reject) => {
                img.onload = resolve
                img.onerror = reject
            })

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            canvas.width = croppedAreaPixels.width
            canvas.height = croppedAreaPixels.height

            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            )

            canvas.toBlob((blob) => {
                if (blob) onCropComplete(blob)
            }, 'image/jpeg', 0.9)
        } catch (e) {
            console.error('Failed to crop image', e)
        }
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black border-b-2 border-white/10">
                <div className="flex items-center gap-2">
                    <span className="bg-[#adff2f] text-black px-2 py-0.5 text-[10px] font-black uppercase">Image_Cropper</span>
                    <span className="text-white/40 text-[10px] font-mono uppercase">Ratio 16:9</span>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={onCancel}
                        className="text-white hover:text-[#adff2f] transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="relative flex-1 bg-[#111]">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={onZoomChange}
                />
            </div>

            <div className="p-6 bg-black border-t-2 border-white/10 space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-white font-mono text-[10px] uppercase opacity-40">Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e: any) => setZoom(e.target.value)}
                        className="flex-1 accent-[#adff2f]"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 border-2 border-white/20 text-white py-4 font-black uppercase text-xs hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createCroppedImage}
                        className="flex-1 bg-[#adff2f] border-2 border-black text-black py-4 font-black uppercase text-xs brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} />
                        Apply_Crop
                    </button>
                </div>
            </div>
        </div>
    )
}
