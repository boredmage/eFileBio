import { prisma } from "@/lib/db";
import { stripe } from "@/utils/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    });
  }

  if (event.type === "checkout.session.completed") {
    const { userId, businessId, formId, fillingType } = session.metadata;

    const statusBasedOnFillingType = {
      "direct-filling": "SUBMITTED",
      "review-filling": "INREVIEW",
    } as const;

    // TODO: Update the user's payment status in the database.
    await prisma.form.update({
      where: {
        id: formId,
        business: {
          id: businessId,
        },
      },
      data: {
        status:
          statusBasedOnFillingType[
            fillingType as keyof typeof statusBasedOnFillingType
          ],
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log(JSON.stringify(session, null, 2));

    // TODO: Update the user's payment status in the database.
  }

  return new Response(null, { status: 200 });
}
