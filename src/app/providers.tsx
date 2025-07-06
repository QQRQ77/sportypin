'use client'

import { HeroUIProvider } from "@heroui/system";       

type ProvidersProps = {
    children: React.ReactNode
}

export default function Providers({children}: ProvidersProps) {
return (
        <HeroUIProvider>
                {children}
        </HeroUIProvider>
)}