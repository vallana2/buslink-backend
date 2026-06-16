import prisma from "../../config/database";

export const getBookingReportService = async (
  agencyId: string,
  startDate?: string,
  endDate?: string
) => {
  const where: any = {
    schedule: { route: { agencyId } },
  };

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      schedule: {
        include: {
          route: { include: { fromStation: true, toStation: true } },
        },
      },
    },
  });

  const totalBookings = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "USED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;

  return { totalBookings, confirmed, cancelled, pending, bookings };
};

export const getRevenueReportService = async (
  agencyId: string,
  startDate?: string,
  endDate?: string
) => {
  const where: any = {
    booking: {
      schedule: { route: { agencyId } },
    },
    status: "SUCCESS",
  };

  if (startDate || endDate) {
    where.paidAt = {};
    if (startDate) where.paidAt.gte = new Date(startDate);
    if (endDate) where.paidAt.lte = new Date(endDate);
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      booking: {
        include: {
          schedule: {
            include: {
              route: { include: { fromStation: true, toStation: true } },
            },
          },
        },
      },
    },
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // Group by route
  const byRouteMap: Record<string, { route: string; revenue: number; tickets: number }> = {};

  for (const p of payments) {
    const route = p.booking.schedule.route;
    const key = `${route.fromStation.city} → ${route.toStation.city}`;

    if (!byRouteMap[key]) {
      byRouteMap[key] = { route: key, revenue: 0, tickets: 0 };
    }
    byRouteMap[key].revenue += p.amount;
    byRouteMap[key].tickets += 1;
  }

  return {
    totalRevenue,
    totalTransactions: payments.length,
    byRoute: Object.values(byRouteMap),
  };
};

// System Admin — platform-wide overview
export const getPlatformOverviewService = async () => {
  const totalAgencies = await prisma.agency.count({ where: { isApproved: true } });
  const totalUsers = await prisma.user.count();
  const totalBookings = await prisma.booking.count();
  const totalRevenue = await prisma.payment.aggregate({
    where: { status: "SUCCESS" },
    _sum: { amount: true },
  });

  return {
    totalAgencies,
    totalUsers,
    totalBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
  };
};