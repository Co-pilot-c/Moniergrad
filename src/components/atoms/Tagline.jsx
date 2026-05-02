export default function Tagline({children}) {
    return (
        <div className="inline-flex items-center gap-2 mb-4 animate-fadeSlideUp">
            <div className="w-8 h-0.5 bg-gradient-green rounded-full"></div>
            <h3 className="font-poppins font-semibold text-lg md:text-xl lg:text-2xl text-primary-600 font-medium uppercase tracking-wide">{children}</h3>
            <div className="w-8 h-0.5 bg-gradient-green rounded-full"></div>
        </div>
    )
}