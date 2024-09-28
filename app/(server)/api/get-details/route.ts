import { prisma } from "@/lib/prisma";

export async function GET(request:Request) {
    const email  = await request.json();
    const user = await prisma.user.findUnique({
        where:{
            email:email.email
        },
    })   
}