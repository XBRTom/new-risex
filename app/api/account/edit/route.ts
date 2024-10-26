import { auth } from "@/auth"
import prisma from '@/libs/prisma';

export const POST = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: "Not authenticated 1" }, { status: 401 });
  }

  console.log(req.auth);
  const currentUser = req.auth.user;
  if (!currentUser?.email)
    return Response.json({ message: "Not authenticated 2" }, { status: 401 });

  const { email, fullName, phoneNumber } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: currentUser.email },
      data: {
        name: fullName,
        phoneNumber,
      },
    });

    return Response.json({ user: updatedUser });
  } catch (error) {
    console.error('Failed to update user data:', error);
    return Response.json({ message: "Failed to update user data" }, { status: 500 });
  }
}) as any // TODO: Fix `auth()` return type