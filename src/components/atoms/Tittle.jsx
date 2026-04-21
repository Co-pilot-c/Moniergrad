export default function Tittle({ children }) {
    return (
        <h1 className="text-3xl md:text-4xl lg:text-5xl w-2/3 mx-auto font-bold text-gray-900 mb-4">
            {children}
        </h1>
    );
}