'use client'

import { HeroUIProvider } from "@heroui/system";
import {ClerkProvider} from "@clerk/nextjs";    
import { plPL } from '@clerk/localizations';


type ProvidersProps = {
    children: React.ReactNode
}

export default function Providers({children}: ProvidersProps) {
return (
        <ClerkProvider localization={plPL}>
                <HeroUIProvider>
                        {children}
                </HeroUIProvider>
        </ClerkProvider>
)}