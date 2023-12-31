import { prisma } from "$lib/server/prisma";
import { resend } from "$lib/server/resend";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const bodyPromise = new Response(request.body, {
    headers: { "Content-Type": "application.json" },
  }).json();

  const body = await bodyPromise;
  console.log(`POST body ${JSON.stringify(body)}`);

  const { id } = body;
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { recipients: true },
  });

  if (plan) {
    let emails: string[] = [];
    plan.recipients.map((r) => {
      emails = [...emails, r.email];
    });
    const resend_data = await resend.emails.send({
      from: "Rendevouz <onboarding@resend.dev>",
      to: emails,
      subject: plan.description,
      html: `
      <strong>Rendevouz RN</strong>
      <p>${plan.description}</p>
      <p>Participants: ${emails.toString()}</p>
      <p>TIME: ${plan.time}</p>
      `,
    });
  }

  return json(plan?.id);
}
