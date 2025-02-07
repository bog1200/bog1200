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
            <h1 className={`text-3xl lg:text-9xl mt-40`}>COMING SOON!</h1>
        </div>
    );
}