import { Webhook } from "svix";
import { headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export async function POST(req: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Verify signature
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
    wh.verify(JSON.stringify(body), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Handle events
  const event = body.type;

  if (event === "user.created") {
    const { id, email_addresses, first_name, image_url } = body.data;
    
    // Store user in Convex database
    try {
      await convex.mutation("posts:storeUser", {
        tokenIdentifier: email_addresses[0].email_address,
        name: first_name || email_addresses[0].email_address,
        profileImage: image_url || undefined,
      });
    } catch (e) {
      console.error("Error storing user:", e);
    }
  }

  return new Response("OK", { status: 200 });
}
