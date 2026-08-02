"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const english_name = String(formData.get("english_name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const github = String(formData.get("github") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const avatar_url = String(formData.get("avatar_url") ?? "").trim();

  const { error } = await supabase
    .from("about_profile")
    .update({ name, english_name, title, bio, email, github, location, avatar_url })
    .eq("id", 1);

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

// --- Experiences ---

export async function createExperience(formData: FormData) {
  const supabase = await createClient();

  const period = String(formData.get("period") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const org = String(formData.get("org") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);

  const { error } = await supabase
    .from("about_experiences")
    .insert({ period, role, org, description, sort });

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient();

  const period = String(formData.get("period") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const org = String(formData.get("org") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);

  const { error } = await supabase
    .from("about_experiences")
    .update({ period, role, org, description, sort })
    .eq("id", id);

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  await supabase.from("about_experiences").delete().eq("id", id);
  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

// --- Skills ---

export async function createSkill(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const level = Number(formData.get("level") ?? 80);
  const sort = Number(formData.get("sort") ?? 0);

  const { error } = await supabase.from("about_skills").insert({ name, level, sort });

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const level = Number(formData.get("level") ?? 80);
  const sort = Number(formData.get("sort") ?? 0);

  const { error } = await supabase
    .from("about_skills")
    .update({ name, level, sort })
    .eq("id", id);

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  await supabase.from("about_skills").delete().eq("id", id);
  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

// --- Certificates ---

export async function createCertificate(formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const issuing_authority = String(formData.get("issuing_authority") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);

  const { error } = await supabase
    .from("about_certificates")
    .insert({ name, issuing_authority, sort });

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function updateCertificate(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const issuing_authority = String(formData.get("issuing_authority") ?? "").trim();
  const sort = Number(formData.get("sort") ?? 0);

  const { error } = await supabase
    .from("about_certificates")
    .update({ name, issuing_authority, sort })
    .eq("id", id);

  if (error) {
    redirect(`/admin/about?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient();
  await supabase.from("about_certificates").delete().eq("id", id);
  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}
