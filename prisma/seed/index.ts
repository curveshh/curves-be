import { PublicationStatus } from '@prisma/client';

import { prisma } from './client';

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: 'curves-settings' },
    update: {},
    create: {
      id: 'curves-settings',
      siteName: 'Curves Vietnam',
      tagline: '30 phút mỗi ngày cho một cơ thể khỏe mạnh hơn',
    },
  });

  const pages = [
    { key: 'HOME' as const, title: 'Trang chủ', slug: 'trang-chu' },
    { key: 'ABOUT' as const, title: 'Về Curves', slug: 've-curves' },
    { key: 'CONTACT' as const, title: 'Liên hệ', slug: 'lien-he' },
  ];

  for (const page of pages) {
    await prisma.sitePage.upsert({
      where: { key: page.key },
      update: {},
      create: { ...page, status: PublicationStatus.PUBLISHED, publishedAt: new Date() },
    });
  }

  const circuitTraining = await prisma.programCategory.upsert({
    where: { slug: 'circuit-training' },
    update: {},
    create: {
      name: 'Tập luyện Curves',
      slug: 'circuit-training',
      description: 'Bài tập vòng tròn 30 phút dành cho phụ nữ.',
    },
  });

  await prisma.trainingProgram.upsert({
    where: { slug: 'curves-30-phut' },
    update: {},
    create: {
      categoryId: circuitTraining.id,
      name: 'Curves 30 phút',
      slug: 'curves-30-phut',
      shortDescription: 'Tập toàn thân hiệu quả trong 30 phút.',
      level: 'ALL_LEVELS',
      durationMinutes: 30,
      status: PublicationStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  const plan = await prisma.membershipPlan.upsert({
    where: { slug: 'goi-trai-nghiem' },
    update: {},
    create: {
      name: 'Gói trải nghiệm',
      slug: 'goi-trai-nghiem',
      price: 0,
      billingMonths: 1,
      isFeatured: true,
    },
  });

  await prisma.planFeature.upsert({
    where: { id: 'trial-plan-feature' },
    update: {},
    create: { id: 'trial-plan-feature', planId: plan.id, content: 'Tư vấn và tập thử cùng huấn luyện viên' },
  });

  console.log('Curves seed data created.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
