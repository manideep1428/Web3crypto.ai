'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateUserProfile(userId: string, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const image = formData.get('image') as string

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, email, image },
    })
    revalidatePath('/profile')
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Failed to update profile:', error)
    return { success: false, message: 'Failed to update profile' }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return user
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    return null
  }
}