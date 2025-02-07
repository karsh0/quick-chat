export function Navbar() {
    return (
        <nav className="bg-transparent backdrop-blur-md  w-full fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
                {/* Logo */}
                <div className="text-white text-2xl font-bold">ChatApp</div>

                {/* Nav Links */}
                <ul className="hidden lg:flex gap-8 text-white text-lg">
                    <li className="hover:text-blue-400 transition-all cursor-pointer">Home</li>
                    <li className="hover:text-blue-400 transition-all cursor-pointer">About</li>
                    <li className="hover:text-blue-400 transition-all cursor-pointer">Features</li>
                    <li className="hover:text-blue-400 transition-all cursor-pointer">Contact</li>
                </ul>

                {/* Mobile Menu Button (Optional) */}
                <button className="lg:hidden text-white text-2xl">☰</button>
            </div>
        </nav>
    );
}
