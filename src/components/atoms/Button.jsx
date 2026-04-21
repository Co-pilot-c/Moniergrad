export default function Button({ type = "Button", onClick, href, children }) {
    if (href) {
        return (
            <a
             href={href} 
             className="px-7 py-2.5 rounded-full shadow-md text-white bg-sky-500 hover:bg-sky-600 transition duration-300">
                {children}
            </a>
        );
    }
    
        return (
            <button
                type={type}
                onClick={onClick}
                className="bg-sky-500 px-3 py-2 text-grey-900 hover:bg-sky-600 rounded-lg">
                {children}
            </button>
        );
}