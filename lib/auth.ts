import db from "@/lib/db";

export async function verifyResetToken(token: string): Promise<string | null> {
    const user = await db.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordTokenExpiry: {
                gt: new Date()
            }
        }
    });
    
    return user ? user.email : null;
} 