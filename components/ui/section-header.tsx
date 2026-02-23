export const SectionHeader = ({ title, className = "" }: { title: string, className?: string }) => (
    <div className={`mb-20 inline-block bg-black text-white p-6 neo-shadow ${className}`}>
        <h2 className="text-5xl font-extrabold uppercase italic leading-none">
            {title}
        </h2>
    </div>
);
