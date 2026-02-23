import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    [key: string]: any;
}) => {
    const variants = {
        primary:
            'bg-neon text-black border-2 border-black brutal-shadow-hover',
        secondary:
            'bg-black text-white border-2 border-black brutal-shadow-hover',
        outline:
            'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
    };

    return (
        <button
            className={`px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
