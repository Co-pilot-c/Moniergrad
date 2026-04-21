export default function NavLinks({ href, children }) {
    return (
        <a href={href} className="hover:underline cursor-pointer">
            {children}
        </a>
    );
}