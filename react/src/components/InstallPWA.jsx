import { useEffect, useState } from "react";

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("El usuario instaló la PWA");
                } else {
                    console.log("El usuario canceló la instalación");
                }
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <>
            {deferredPrompt && (
                <button
                    onClick={handleInstallClick}
                    className="p-2 bg-primary-orange text-white font-bold rounded-full"
                >
                    Instalar PWA
                </button>
            )}
        </>
    );
};

export default InstallPWA;
