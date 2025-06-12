"use client";
import Image from "next/image";



export default function Home() {
    return (
        <div className={"flex flex-col items-center justify-center h-screen"}>
            <Image
                src="/rapp_square.svg"
                alt="R.APP logo"
                width={200}
                height={200}
                priority
            />
            <h1 className={`text-3xl lg:text-9xl mt-40 font-light`}>Coming Soon!</h1>
            <>
                <div className="relative h-1 w-3/4 mt-10 bg-neutral-800 overflow-hidden rounded">
                    <div className="absolute h-full w-[60%] inset-0 animate-loadingBar bg-gradient-to-r from-red-800 via-yellow-400  to-blue-800">
                    </div>
                </div>
            </>
        </div>
    );
}