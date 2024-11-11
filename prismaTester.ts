// testPrismaUpdate.ts

import prisma from "@/lib/db"; // Import Prisma instance

async function testPrismaUpdate() {
    try {
        const email = 'vesa.rs.92@gmail.com'; // Test with the same email as in your logic

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                resetPasswordToken: true,
                resetPasswordTokenExpiry: true
            }
        });

        console.log('Found User:', user);

        if (user) {
            const resetPasswordToken = 'newToken123'; // Simulate a token
            const expiryDate = new Date(); // Set the expiry date

            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    resetPasswordToken,
                    resetPasswordTokenExpiry: expiryDate,
                },
                select: {
                    email: true,
                    resetPasswordToken: true,
                    resetPasswordTokenExpiry: true
                }
            });

            console.log('Updated User:', updatedUser);
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error testing Prisma update:', error);
    } finally {
        await prisma.$disconnect(); // Always disconnect after operations
    }
}

// Self-executing async function
(async () => {
    await testPrismaUpdate();
})();
