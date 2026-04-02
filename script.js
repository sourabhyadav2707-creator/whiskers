import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://bfcvdbysyfegdwcgdqxf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LkEZw5Jx3i1-EqoaMiilEw_SaNDBh7z";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const form = document.getElementById("waitlist-form");
const emailInput = document.getElementById("waitlist-email");
const submitButton = form.querySelector('button[type="submit"]');
const formNote = document.getElementById("form-note");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setSubmittingState(isSubmitting) {
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Joining..." : "Join waitlist";
}

emailInput.addEventListener("input", () => {
  emailInput.setCustomValidity("");
  formNote.textContent = "Early access for creators.";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  if (!emailPattern.test(email)) {
    emailInput.setCustomValidity("Please enter a valid email address.");
    emailInput.reportValidity();
    formNote.textContent = "Enter a valid email.";
    return;
  }

  setSubmittingState(true);

  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    const duplicateEmail = error.code === "23505" || /duplicate|unique/i.test(error.message);

    formNote.textContent = duplicateEmail ? "You’re already on the list." : "Something went wrong. Try again.";
    setSubmittingState(false);
    return;
  }

  form.reset();
  formNote.textContent = "You’re on the list.";
  setSubmittingState(false);
});
