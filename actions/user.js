"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { use } from "react";

export async function updateUser(data) {
  // check if user is logged in
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // check if user exits in database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  // updating user
  try {
    const result = await db.$transaction(
      async (tx) => {
        // 1st step: find it the industry exists
        let industryInsight = await tx.industryInsights.findUnique({
          where: {
            industry: data.industry,
          },
        });
        // 2nd step: if industry does not exist, create it with default values - will replace it with AI later
        if (!industryInsight) {
          industryInsight = await tx.industryInsights.create({
            data: {
              industry: data.industry,
              salaryRanges: [], //Default empty array
              growthRate: 0, //Default value
              demandLevel: "Medium", // Default value
              topSkills: [], //Default empty array
              MarketOutlook: "Neutral", //Default value
              KeyTrends: [], //Default empty array
              recommendedSkills: [], //Default empty array
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            },
          });
        }
        // 3rd step: update the user
        const updateUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });
        return { updateUser, industryInsight };
      },
      {
        timeout: 10000,
      }
    );
    return result.user;
  } catch (error) {
    console.log("Error updating user and industry", error.message);
    throw new Error("Failed to update profile");
  }
}

// server action to fectch onboarding status
export async function getUserOnboardingStatus() {
  // check if user is logged in
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // check if user exits in database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });
    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Erro checking onboarding status", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
