import { resend } from "$lib/server/resend";
import { prisma } from "$lib/server/prisma";
import { QSTASH_TOKEN } from "$env/static/private";

export const actions = {
  sendPlan: async ({ request }) => {
    const form_data = await request.formData();
    const email_1 = form_data.get("email_1");
    const email_2 = form_data.get("email_2");
    const description = form_data.get("description");
    const time = form_data.get("time");

    /**
    const plan_data = await prisma.plan.create({
      data: {
        description,
        time: new Date(time).toISOString(),
        recipients: {
          create: [
            { email: email_1 },
            { email: email_2 }
          ]
        }
      }
    });

    console.log({ plan_data });

    const resend_data = await resend.emails.send({
      from: "Plans <onboarding@resend.dev>",
      to: [ email_1, email_2 ],
      subject: description,
      html: `
        <strong>PLANS MADE</strong>
        <p>${description}</p>
        <p>Participants: ${email_1}, ${email_2}</p>
        <p>TIME: ${time}</p>
      `
    });


    console.log({ resend_data });

    */

    const qstash_data = await fetch("https://qstash.upstash.io/v1/publish/https://7862-2600-6c50-6500-2db-00-1c02.ngrok-free.app/api/rendevouz", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${QSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email_1 })
    });

    console.log({ qstash_data });
  },
}
