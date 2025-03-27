import React, { useEffect } from "react";

const CliengoChat = ({
    scriptUrl = "https://s.cliengo.com/weboptimizer/620babf8fce1e6002a464f63/620babfafce1e6002a464f68.js?platform=view_installation_code",
}) => {
    useEffect(() => {
        // Create script element
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = scriptUrl;

        // Insert script into the document
        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        // Optional: Clean up script on component unmount
        return () => {
            if (firstScript.parentNode.contains(script)) {
                firstScript.parentNode.removeChild(script);
            }
        };
    }, [scriptUrl]);

    return null; // This component doesn't render anything visually
};

export default CliengoChat;
