"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/db";
import { stripe } from "@/utils/stripe";
import { absoluteUrl } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const PLANS = [
  {
    slug: "direct-filling",
    priceId: process.env.DIRECT_FILLING_PRICE_ID,
  },

  {
    slug: "review-filling",
    priceId: process.env.REVIEW_FILLING_PRICE_ID,
  },
];

export async function createCheckoutSession(
  businessId: string,
  formId: string,
  fillingType: "direct-filling" | "review-filling",
) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user || !user.id) {
    return redirect("/");
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: absoluteUrl(`/dashboard/${businessId}`),
    cancel_url: absoluteUrl(`/dashboard/${businessId}/${formId}`),
    payment_method_types: ["card"],
    mode: "payment",
    billing_address_collection: "auto",
    line_items: [
      {
        price: PLANS.find((plan) => plan.slug === fillingType)?.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      formId,
      businessId,
      fillingType,
      userId: user.id,
    },
  });

  return { url: stripeSession.url };
}
