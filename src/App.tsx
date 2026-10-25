// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, Heart } from 'lucide-react';
import SmartFAQ from './components/SmartFAQ';

const CONFIG = {
    mainTitle: "2ª IGREJA BATISTA DE AREIAS",
    title2: "CRESCENDO EM CRISTO",
    subtitle: "Acolhendo e servindo em amor",
    orgName: "2ª IGREJA BATISTA DE AREIAS",
    avatar: "https://i.postimg.cc/Wq41NJhT/logo-2iba.jpg",
    whatsapp: "5581998370066",
    cnpj: "11547361000179",
    formattedCnpj: "11.547.361/0001-79",
    bankInfo: "SANTANDER - AG.3757 - C.C 13000045-9",
    pixCopiaECola: "00020126440014br.gov.bcb.pix01141154736100017902042IBA5204000053039865802BR5906IGREJA6008BRASILIA62070503***63046C50"
};

const LinkCard = ({ link, index, onClick }: { link: any, index: number, onClick: (path: string) => void }) => {
    const handleAction = (e: React.MouseEvent) => {
        if (link.url && link.url.startsWith('/')) {
            e.preventDefault();
            onClick(link.url);
        } else if (link.action === 'view') {
            e.preventDefault();
            onClick(link.viewId);
        }
    };

    const isConstrucao = link.status === "construção" || link.status === "construcao";
    
    const baseClasses = "relative flex items-center justify-center w-full py-4 px-6 rounded-full font-bold text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-fade-in-up opacity-0 animate-fill-forwards shadow-lg text-center border-2 border-brand-green";
    const styleClasses = "bg-white text-brand-green hover:bg-brand-green hover:text-white";
    const disabledClasses = isConstrucao ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer";

    return (
        <div className="relative w-full">
            <a
                href={link.url || "javascript:void(0)"}
                target={link.url && link.url !== "#" ? "_blank" : "_self"}
                rel="noreferrer"
                className={`${baseClasses} ${styleClasses} ${disabledClasses}`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
                onClick={handleAction}
            >
                <div className="flex items-center justify-center gap-2">
                    <span>{link.label}</span>
                    {isConstrucao && (
                        <span className="text-[7px] font-black opacity-60 tracking-tighter whitespace-nowrap uppercase">
                            EM CONSTRUÇÃO
                        </span>
                    )}
                </div>
            </a>
        </div>
    );
};

const MainApp: React.FC = () => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [currentView, setCurrentView] = useState('main');
    const [copied, setCopied] = useState(false);
    const [copiedCopiaCola, setCopiedCopiaCola] = useState(false);
    
    const [links, setLinks] = useState<any[]>([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const tsvUrl = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTqkMO8HgVuAbtxBg_PakQxPDm_4mKugBtB1zDJOvOs3WC4eLBmF61J6AGNUey5MUWaJVrtK0DKP6e3/pub?output=tsv&t=${Date.now()}`; 
            
            try {
                const response = await fetch(tsvUrl, { cache: "no-store" });
                const data = await response.text();
                
                const rows = data.split('\n').map(row => row.trim()).filter(row => row);
                
                const parsedLinks = rows.slice(1).map(row => {
                    const values = row.split('\t');
                    return {
                        id: values[0]?.trim(),
                        label: values[1]?.trim(),
                        url: values[2]?.trim(),
                        status: values[3]?.trim() || undefined
                    };
                }).filter(link => link.label && link.url);
                
                setLinks(parsedLinks);
            } catch (error) {
                console.error("Erro ao carregar links da planilha:", error);
            }
        };

        fetchLinks();
    }, []);

    useEffect(() => {
        const handleRouting = () => {
            const path = window.location.pathname.replace(/\/\$/, "");
            if (path === '/dizimo' || path === '/dizimos') {
                setCurrentView('generosidade');
            } else {
                setCurrentView('main');
            }
        };

        handleRouting();
        setLoaded(true);
        
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }

        window.addEventListener('popstate', handleRouting);
        return () => window.removeEventListener('popstate', handleRouting);
    }, []);

    const navigateTo = (path: string) => {
        if (path.startsWith('/')) {
            window.history.pushState({}, '', path);
            const cleanPath = path.replace(/\/\$/, "");
            if (cleanPath === '/dizimo' || cleanPath === '/dizimos') {
                setCurrentView('generosidade');
            } else {
                setCurrentView('main');
            }
        } else {
            setCurrentView(path);
        }
    };

    const handleCopyPix = () => {
        navigator.clipboard.writeText(CONFIG.cnpj);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyCopiaCola = () => {
        navigator.clipboard.writeText(CONFIG.pixCopiaECola);
        setCopiedCopiaCola(true);
        setTimeout(() => setCopiedCopiaCola(false), 2000);
    };

    const renderMainView = () => (
        <>
            <header className="text-center mb-6 animate-fade-in-down w-full px-2 flex flex-col items-center">
                <div className="relative inline-block mb-8 group cursor-pointer">
                    <div className="absolute -inset-4 bg-brand-green rounded-full blur-2xl opacity-15 group-hover:opacity-25 transition duration-700"></div>
                    <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-brand-green bg-white shadow-2xl overflow-hidden p-0.5">
                        <img 
                            src={CONFIG.avatar} 
                            className="w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            alt="Logo Igreja" 
                        />
                    </div>
                </div>
                
                <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-brand-green uppercase leading-tight">
                    {CONFIG.mainTitle}
                </h1>
                <h2 className="text-lg font-bold tracking-tight mb-2 text-brand-green/90 uppercase leading-tight">
                    {CONFIG.title2}
                </h2>
                <p className="text-brand-green/70 font-medium text-xs sm:text-sm italic">
                    {CONFIG.subtitle}
                </p>
            </header>

            {/* Nova Seção de Ícones Sociais */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 w-full animate-fade-in-down px-4">
                <a href="https://www.instagram.com/2ibareias/" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-white text-brand-green border-2 border-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                        <Instagram size={22} />
                    </div>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider">Oficial</span>
                </a>
                
                <a href="https://www.instagram.com/2ibamoving/?hl=pt-br" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-white text-brand-green border-2 border-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                        <Instagram size={22} />
                    </div>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider">Moving</span>
                </a>

                <a href="https://www.instagram.com/trilho2iba/?hl=pt-br" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-white text-brand-green border-2 border-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                        <Instagram size={22} />
                    </div>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider">Trilho</span>
                </a>

                <a href="https://www.youtube.com/c/2aIgrejaBatistadeAreias" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-white text-brand-green border-2 border-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                        <Youtube size={22} />
                    </div>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider">YouTube</span>
                </a>

                <a href="https://www.whatsapp.com/channel/0029VaGtOo06BIEZeDmTCx3j?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnXBC4Hm7UlleTxgfAun_cuqtOcO4XtXOZSv10Fpf8r8_bi4xpgAByU_vYNlA_aem_fVUdOvmVck6Oh1eIzi8SHg" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 group">
                    <div className="p-3 bg-white text-brand-green border-2 border-brand-green rounded-full group-hover:bg-brand-green group-hover:text-white transition-all shadow-sm">
                        <MessageCircle size={22} />
                    </div>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-wider">Canal</span>
                </a>
            </div>

            <div className="w-full space-y-4 px-2">
                {/* Botão Fixo e Nativo para Dízimo e Ofertas */}
                <button
                    onClick={() => navigateTo('/dizimo')}
                    className="relative flex items-center justify-center w-full py-4 px-6 mb-2 rounded-full font-bold text-base uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-fade-in-up opacity-0 animate-fill-forwards shadow-lg text-center border-2 border-brand-green bg-brand-green text-white hover:bg-brand-green/90"
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="flex items-center gap-2">
                        <Heart size={20} className="text-white" />
                        <span>DÍZIMO E OFERTAS</span>
                    </div>
                </button>

                {/* Renderização Dinâmica dos Links do Sheets */}
                {loaded && links.map((link, i) => (
                    <LinkCard key={link.id} link={link} index={i + 1} onClick={(path) => navigateTo(path)} />
                ))}
            </div>
        </>
    );

    const renderGenerosityView = () => (
        <div className="w-full animate-fade-in-up">
            <button 
                onClick={() => navigateTo('/')}
                className="mb-8 flex items-center text-brand-green font-bold text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
                VOLTAR
            </button>

            <header className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-brand-green uppercase mb-4 tracking-tight">
                    DÍZIMO E OFERTAS
                </h2>
                
                <div className="bg-white/50 border-2 border-brand-green/20 rounded-3xl p-6 mb-8 text-brand-green shadow-inner">
                    <p className="font-bold text-lg mb-2">PIX/CNPJ: {CONFIG.formattedCnpj}</p>
                    <p className="text-sm font-medium opacity-80">{CONFIG.bankInfo}</p>
                </div>

                <p className="text-brand-green/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                    CLIQUE NO BOTÃO ABAIXO PARA COPIAR A CHAVE PIX:
                </p>
            </header>

            <button
                onClick={handleCopyPix}
                className="flex flex-col items-center justify-center w-full py-6 px-8 bg-brand-green text-white rounded-2xl font-bold text-lg uppercase tracking-widest shadow-2xl hover:bg-brand-green/90 transition-all transform hover:scale-[1.02] active:scale-95 border-b-4 border-black/20 mb-4"
            >
                <span className="text-2xl mb-1">{CONFIG.cnpj}</span>
                <span className="text-[10px] opacity-70">
                    {copied ? "✓ COPIADO! COLE NO SEU BANCO" : "CLIQUE PARA COPIAR CNPJ"}
                </span>
            </button>

            <button
                onClick={handleCopyCopiaCola}
                className="flex flex-col items-center justify-center w-full py-4 px-8 bg-white text-brand-green rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg hover:bg-gray-50 transition-all transform hover:scale-[1.02] active:scale-95 border-2 border-brand-green"
            >
                <span className="text-[10px] opacity-70 mb-1">PIX COPIA E COLA (CHAVE ALEATÓRIA)</span>
                <span className="text-xs truncate w-full px-4">{CONFIG.pixCopiaECola}</span>
                <span className="text-[10px] mt-2 font-black">
                    {copiedCopiaCola ? "✓ CÓDIGO COPIADO!" : "CLIQUE PARA COPIAR CÓDIGO"}
                </span>
            </button>
            
            <div className="mt-8 text-center text-brand-green/50 text-xs italic">
                "Cada um contribua segundo propôs no seu coração" <br/> 2 Co 9:7
            </div>
        </div>
    );

return (
        <div className="min-h-[100dvh] w-full relative overflow-x-hidden bg-brand-bg text-gray-800 flex flex-col items-center font-sans">
            <main className="relative z-10 w-full max-w-md px-6 py-12 flex flex-col items-center min-h-[100dvh]">
                
                {currentView === 'main' ? renderMainView() : 
                 currentView === 'generosidade' ? renderGenerosityView() : 
                 renderMainView()}

                <footer className="mt-auto pt-16 text-center animate-fade-in-up opacity-0 animate-fill-forwards w-full pb-8" style={{ animationDelay: '1000ms' }}>
                    <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-bold mb-2">
                        {CONFIG.orgName}
                    </p>
                    <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase font-medium">
                        © 2026 RECIFE - PE
                    </p>
                </footer>
            </main>
        </div>
    )};

    const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainApp />} />
                <Route path="/chat2iba" element={<SmartFAQ />} />
                <Route path="*" element={<MainApp />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;