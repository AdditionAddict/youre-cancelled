import { resend } from "$lib/server/resend";
import { prisma } from "$lib/server/prisma";
import { QSTASH_TOKEN } from "$env/static/private";

export const actions = {
  sendPlan: async ({ request }) => {
    const form_data = await request.formData();
    const emailOneFormValue = form_data.get("email_1");
    const emailTwoFormValue = form_data.get("email_2");
    const descriptionFormValue = form_data.get("description");
    const timeFormValue = form_data.get("time");

    if (emailOneFormValue === null) throw new Error("email_1 is null");
    if (emailTwoFormValue === null) throw new Error("email_2 is null");
    if (descriptionFormValue === null) throw new Error("description is null");
    if (timeFormValue === null) throw new Error("time is null");

    const emailOne = emailOneFormValue.toString();
    const emailTwo = emailTwoFormValue.toString();
    const description = descriptionFormValue.toString();
    const time = timeFormValue.toString();

    const plan_data = await prisma.plan.create({
      data: {
        description,
        time: new Date(time).toISOString(),
        recipients: {
          create: [{ email: emailOne }, { email: emailTwo }],
        },
      },
    });

    console.log({ plan_data });

    const resend_data = await resend.emails.send({
      from: "Plans <onboarding@resend.dev>",
      to: [emailOne, emailTwo],
      subject: description,
      html: `
        <strong>PLANS MADE</strong>
        <p>${description}</p>
        <p>Participants: ${emailOne}, ${emailTwo}</p>
        <p>TIME: ${time}</p>
      `,
    });

    console.log({ resend_data });

    const timeAsSeconds = Math.floor(new Date(time.valueOf()).getTime() / 1000);

    const qstash_data = await fetch(
      `https://qstash.upstash.io/v1/publish/${process.env.SITE_URL}/api/rendevouz`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${QSTASH_TOKEN}`,
          "Content-Type": "application/json",
          "Upstash-Not-Before": `${timeAsSeconds}`,
        },
        body: JSON.stringify({ id: resend_data.id }),
      }
    );

    console.log({ qstash_data });
  },
};
