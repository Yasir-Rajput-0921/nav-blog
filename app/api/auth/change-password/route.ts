import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Please login first!" },
      { status: 401 }
    );
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "All fields are required!" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters long!" },
      { status: 400 }
    );
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json(
      { error: "User not found!" },
      { status: 404 }
    );
  }

  if (user.provider === "google") {
    return NextResponse.json(
      { error: "Google account found! Password change not allowed." },
      { status: 400 }
    );
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect!" },
      { status: 400 }
    );
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await supabaseAdmin
    .from("users")
    .update({ password: hashedNewPassword })
    .eq("email", session.user.email);

  return NextResponse.json({
    message: "Password updated successfully! ✅",
  });
}