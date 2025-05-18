import Image from "next/image";


export default function Home() {
    return (
        <div className={"flex flex-col items-center justify-center h-screen"}>
            <Image
                src="/rapp_square.svg"
                alt="Next.js logo"
                width={200}
                height={200}
                priority
            />
            <h1 className={`text-3xl lg:text-9xl mt-40 font-light`}>Coming Soon!</h1>
            <div className={"bg-gradient-to-r from-red-700 from-20% via-yellow-400  to-80% to-blue-700 h-1 w-3/4 mt-10"}></div>
        </div>
    );
}