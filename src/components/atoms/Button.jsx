export default function Button({ type = "Button", onClick, href, children, variant = "primary" }) {
    const baseClasses = "px-6 py-3 rounded-full font-medium transition-all duration-400 transform hover:scale-105 shadow-soft hover:shadow-medium";
    
    const variantClasses = {
        primary: "bg-gradient-green text-white shadow-green hover:shadow-medium",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:border-primary-500 hover:bg-primary-50",
        outline: "bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
        ghost: "bg-transparent text-primary-600 hover:bg-primary-100"
    };

    const classes = `${baseClasses} ${variantClasses[variant] || variantClasses.primary}`;

    if (href) {
        return (
            <a
             href={href} 
             className={classes}>
                {children}
            </a>
        );
    }
    
        return (
            <button
                type={type}
                onClick={onClick}
                className={classes}>
                {children}
            </button>
        );
}