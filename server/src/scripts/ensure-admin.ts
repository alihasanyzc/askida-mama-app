import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { supabase, supabaseAdmin } from '../config/supabase.js';

async function findAuthUserByEmail(email: string) {
  let page = 1;
  const normalizedEmail = email.trim().toLowerCase();

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(error.message);
    }

    const users = data.users as Array<{ id: string; email?: string | null }>;
    const matchedUser = users.find((user) => user.email?.trim().toLowerCase() === normalizedEmail);

    if (matchedUser) {
      return matchedUser;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureAdmin() {
  let authUser = await findAuthUserByEmail(env.ADMIN_EMAIL);

  if (!authUser) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: env.ADMIN_FULL_NAME,
        username: env.ADMIN_USERNAME,
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? 'Failed to create admin auth user');
    }

    authUser = data.user;
  } else {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      password: env.ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: env.ADMIN_FULL_NAME,
        username: env.ADMIN_USERNAME,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  const conflictingProfile = await prisma.profile.findUnique({
    where: {
      username: env.ADMIN_USERNAME,
    },
  });

  if (conflictingProfile && conflictingProfile.id !== authUser.id) {
    throw new Error('Reserved admin username is already used by another profile');
  }

  await prisma.profile.upsert({
    where: {
      id: authUser.id,
    },
    update: {
      full_name: env.ADMIN_FULL_NAME,
      username: env.ADMIN_USERNAME,
      role: 'admin',
    },
    create: {
      id: authUser.id,
      full_name: env.ADMIN_FULL_NAME,
      username: env.ADMIN_USERNAME,
      role: 'admin',
    },
  });

  const loginResult = await supabase.auth.signInWithPassword({
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  });

  if (loginResult.error) {
    throw new Error(loginResult.error.message);
  }

  console.log(`Admin email: ${env.ADMIN_EMAIL}`);
  console.log(`Admin password: ${env.ADMIN_PASSWORD}`);
}

ensureAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
