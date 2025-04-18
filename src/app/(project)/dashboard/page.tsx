import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth();

    if(!session)
        redirect('/login');
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Protected Dashboard</h1>
            <p>Bem vindo {session?.user?.name}</p>
            <form action={handleAuth}>
                <button type="submit">LogOut</button>
            </form>

            <Link href="/pagamentos" className="border rounded-md px-1 mt-4">Pagamentos</Link>
        </div>
    );
}
