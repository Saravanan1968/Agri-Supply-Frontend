import React from 'react';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    function handleMail() {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/testmail`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                console.log('Return data: ', data);
            })
            .catch(err => {
                console.log('Trouble in connecting to the Server: ', err);
                alert("Trouble in connecting to the Server! Please try again later.");
            });
    }

    return (
        <footer className="bg-background-darker/50 backdrop-blur-md border-t border-white/5 py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <span
                            className="inline-block px-3 py-1 rounded-lg bg-green-100 text-[#2E7D32] font-bold text-sm cursor-pointer hover:bg-green-200 transition-colors mb-2"
                            onClick={handleMail}
                        >
                            Agri SupplyTrack
                        </span>
                        <p className="text-gray-600 text-sm">
                            © 2026 ❤️ All Rights Reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#!" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                            <Github size={18} />
                        </a>
                        <a href="#!" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                            <Twitter size={18} />
                        </a>
                        <a href="#!" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                            <Linkedin size={18} />
                        </a>
                        <a href="#!" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:scale-110">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>

                {/* <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
                    <p>Nehru college, Coimbatore, Tamil Nadu, India.</p>
                </div> */}
            </div>
        </footer>
    );
};

export default Footer;