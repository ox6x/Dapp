import { ChakraProvider } from "@chakra-ui/react";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }: any) {
    const [ownedFarmers, setOwnedFarmers] = useState<any[]>([]);

    useEffect(() => {
        // 假設您從 API 或區塊鏈獲取數據
        async function fetchFarmers() {
            const response = await fetch("/api/farmers");
            const farmers = await response.json();
            setOwnedFarmers(farmers);
        }

        fetchFarmers();
    }, []);

    return (
        <ThirdwebProvider>
            <ChakraProvider>
                {/* 傳入 ownedFarmers */}
                <NavBar ownedFarmers={ownedFarmers} />
                <Component {...pageProps} />
            </ChakraProvider>
        </ThirdwebProvider>
    );
}

export default MyApp;