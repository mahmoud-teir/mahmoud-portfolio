export const SectionHeader = ({ title, className = "" }: { title: string, className?: string }) => (
    <div className={`mb-20 inline-block bg-black text-white p-4 md:p-6 neo-shadow ${className}`}>
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase italic leading-tight md:leading-none">
            {title}
        </h2>
    </div>
);
