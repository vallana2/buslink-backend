export const createBus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { plateNumber, capacity, busType, driverId } = req.body;
    const agencyId = req.user?.agencyId as string;

    if (!plateNumber || !capacity) {
      res.status(400).json({ message: "Plate number and capacity are required" });
      return;
    }

    if (!agencyId) {
      res.status(400).json({ message: "Agency not found" });
      return;
    }

    const bus = await createBusService(
      { plateNumber, capacity, busType, driverId },
      agencyId
    );

    res.status(201).json({
      message: "Bus added successfully",
      bus,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};