import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import stationRoutes from "./modules/stations/stations.routes";
import agencyRoutes from "./modules/agencies/agencies.routes";
import busRoutes from "./modules/buses/buses.routes";
import routeRoutes from "./modules/routes/routes.routes";
import scheduleRoutes from "./modules/schedules/schedules.routes";
import bookingRoutes from "./modules/bookings/bookings.routes";
import paymentRoutes from "./modules/payments/payments.routes";
import ticketRoutes from "./modules/tickets/tickets.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "BusLink API is running 🚌" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/stations", stationRoutes);
app.use("/api/v1/agencies", agencyRoutes);
app.use("/api/v1/buses", busRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/tickets", ticketRoutes);
export default app;