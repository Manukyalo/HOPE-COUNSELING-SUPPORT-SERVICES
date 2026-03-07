export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
                            <span className="text-xl font-bold text-white tracking-tight">HOPE SERVICES</span>
                        </div>
                        <p className="max-w-sm leading-relaxed">
                            Empowering individuals through professional counseling and dedicated support. Your mental health is our priority.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Connect</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Teletherapy</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">In-person</a></li>
                            <li><a href="#" className="hover:text-primary-400 transition-colors">Emergency Info</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Contact</h4>
                        <ul className="space-y-4">
                            <li>support@hopeservices.com</li>
                            <li>+1 (555) 000-1234</li>
                            <li>123 Healing Way, Peace City</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:row justify-between items-center gap-4 text-sm">
                    <p>© 2026 Hope Counseling Support Services. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
