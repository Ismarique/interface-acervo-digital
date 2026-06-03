import { useState, useRef, useEffect, type JSX } from "react";
import { Avatar } from 'primereact/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthRequests from "../../fetch/AuthRequests";
import appIcon from "../../assets/app-icon.png";

function Navegacao(): JSX.Element {
    const [isAuthenticated] = useState(() => {
        const isAuth = localStorage.getItem('isAuth');
        const token = localStorage.getItem('token');
        return !!(isAuth && token && AuthRequests.checkTokenExpiry());
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const nome = localStorage.getItem('nome') || 'Usuário';
    const email = localStorage.getItem('email') || '';
    const avatarImage = "https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png";

    const navLinks = [
        { label: 'Home', icon: 'pi pi-home', url: '/' },
        ...(isAuthenticated ? [
            { label: 'Alunos', icon: 'pi pi-users', url: '/lista/alunos' },
            { label: 'Livros', icon: 'pi pi-book', url: '/lista/livros' },
            { label: 'Empréstimos', icon: 'pi pi-sync', url: '/lista/emprestimos' },
        ] : []),
    ];

    const mobileLinks = navLinks;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="bg-slate-700 shadow-md relative z-50" ref={menuRef}>
            <div className="flex items-center justify-between px-4 py-2 min-h-[64px]">

                {/* Logo */}
                <a href="/" className="flex-shrink-0">
                    <img alt="logo" src={appIcon} className="h-10 w-auto" />
                </a>

                {/* Links — desktop */}
                <nav className="hidden md:flex items-center gap-1 flex-1 ml-6">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.url;
                        return (
                            <a
                                key={link.url}
                                href={link.url}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <i className={`${link.icon} text-sm`}></i>
                                {link.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Usuário — desktop */}
                <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                    {isAuthenticated ? (
                        <>
                            <div className="flex flex-col items-end">
                                <span className="text-white font-semibold text-sm leading-tight">{nome}</span>
                                <span className="text-slate-300 text-xs leading-tight">{email}</span>
                            </div>
                            <Avatar image={avatarImage} shape="circle" className="!w-9 !h-9" />
                            <button
                                onClick={AuthRequests.removeToken}
                                className="flex items-center gap-1.5 bg-white text-slate-700 text-sm font-medium px-4 py-1.5 rounded hover:bg-slate-100 transition-colors border-none cursor-pointer"
                            >
                                <i className="pi pi-sign-out text-xs"></i>
                                Sair
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-1.5 bg-white text-slate-700 text-sm font-medium px-4 py-1.5 rounded hover:bg-slate-100 transition-colors border-none cursor-pointer"
                        >
                            <i className="pi pi-sign-in text-xs"></i>
                            Login
                        </button>
                    )}
                </div>

                {/* Mobile — lado direito */}
                <div className="md:hidden flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <div className="flex flex-col items-end">
                                <span className="text-white font-semibold text-sm leading-tight">{nome}</span>
                                <span className="text-slate-300 text-xs leading-tight">{email}</span>
                            </div>
                            <Avatar image={avatarImage} shape="circle" className="!w-9 !h-9" />
                            <button
                                onClick={AuthRequests.removeToken}
                                className="flex items-center gap-1.5 bg-white text-slate-700 text-sm font-medium px-3 py-1.5 rounded hover:bg-slate-100 transition-colors border-none cursor-pointer"
                            >
                                <i className="pi pi-sign-out text-xs"></i>
                                Sair
                            </button>
                            {/* Hamburguer só para autenticados */}
                            {mobileLinks.length > 0 && (
                                <button
                                    className={`flex items-center justify-center w-20 h-10 rounded-lg active:scale-95 transition-all duration-150 border-none cursor-pointer shadow-md self-center
                                        ${menuOpen ? 'bg-slate-600 text-white' : 'bg-white text-slate-700'}`}
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    aria-label="Abrir menu"
                                >
                                    <i className={`pi ${menuOpen ? 'pi-times' : 'pi-bars'} text-10xl`}>...</i>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Home visível para não autenticados */}
                            <a
                                href="/"
                                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded transition-colors
                                    ${location.pathname === '/'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                <i className="pi pi-home text-xs"></i>
                                Home
                            </a>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-1.5 bg-white text-slate-700 text-sm font-medium px-3 py-1.5 rounded hover:bg-slate-100 transition-colors border-none cursor-pointer"
                            >
                                <i className="pi pi-sign-in text-xs"></i>
                                Login
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Dropdown — mobile (autenticado) */}
            {menuOpen && mobileLinks.length > 0 && (
                <div className="md:hidden bg-slate-800 border-t border-slate-600 px-4 py-3 flex flex-col gap-1 shadow-lg">
                    {mobileLinks.map((link) => {
                        const isActive = location.pathname === link.url;
                        return (
                            <button
                                key={link.url}
                                type="button"
                                onClick={() => navigate(link.url)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <i className={`${link.icon} text-sm w-4 text-center`}></i>
                                {link.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default Navegacao;