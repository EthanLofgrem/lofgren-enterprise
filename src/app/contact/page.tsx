import type { Metadata } from "next";
import { DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = { title: "Contact" };

const input = "mt-1 block w-full rounded-md border border-line bg-panel px-3 py-2 disabled:opacity-60";

export default function Contact() {
  return (
    <Page
      eyebrow="Contact"
      title="Start a conversation"
      intro="Tell us whether you are a producer or a partner and a little about what you do."
    >
      <DraftNotice>
        Applications are not open yet. This form is a preview of the intake that opens in the next release, and it
        does not send or store anything.
      </DraftNotice>
      <form aria-describedby="form-status" className="mt-8 max-w-xl">
        <fieldset disabled className="space-y-5">
          <legend className="sr-only">Application preview</legend>
          <div>
            <span className="block font-semibold">I am a</span>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2"><input type="radio" name="kind" value="producer" defaultChecked /> Producer</label>
              <label className="flex items-center gap-2"><input type="radio" name="kind" value="partner" /> Partner</label>
            </div>
          </div>
          <label className="block">
            <span className="font-semibold">Name</span>
            <input name="name" autoComplete="name" className={input} />
          </label>
          <label className="block">
            <span className="font-semibold">Email</span>
            <input name="email" type="email" autoComplete="email" className={input} />
          </label>
          <label className="block">
            <span className="font-semibold">What do you make or provide?</span>
            <textarea name="summary" rows={4} className={input} />
          </label>
          <button type="submit" className="rounded-md bg-brand px-5 py-3 font-semibold text-brand-ink disabled:opacity-60">
            Submit
          </button>
        </fieldset>
        <p id="form-status" className="mt-4 text-sm text-muted">Submissions open soon.</p>
      </form>
    </Page>
  );
}
