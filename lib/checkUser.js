import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const CheckUser = async () => {
  const user = await currentUser();
  console.log("Current User:", user); // Debugging

  if (!user) {
    console.log("❌ No user found.");
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      console.log("✅ User already exists:", loggedInUser);
      return loggedInUser;
    }

    console.log("🆕 Creating new user...");
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    console.log("✅ User created:", newUser);
    return newUser;
  } catch (error) {
    console.error("🔥 Database Error:", error);
  }
};
