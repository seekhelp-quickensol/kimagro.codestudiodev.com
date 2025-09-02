const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

const { connectMySQL, sequelize } = require("./config/db");

connectMySQL();

app.set("db", sequelize);

app.use((req, res, next) => {
  req.db = sequelize;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const skuRoutes = require("./routes/SKURoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const BannerRoutes = require("./routes/homeBannerRoutes");
const productRoutes = require("./routes/productRoutes");

const commonRoutes = require("./routes/commonRoutes");
const userRoutes = require("./routes/userRoutes");


const innovationRoutes = require("./routes/innovationRoutes");
const mediaModuleRoues = require("./routes/mediaModuleRoutes");
const designationRoutes = require("./routes/designationRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const searchRoutes = require("./routes/searchRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/skus", skuRoutes);
app.use("/api/medias", mediaRoutes);
app.use("/api/banners", BannerRoutes);
app.use("/api/products", productRoutes);

app.use("/api/department", departmentRoutes);
app.use("/api/designation", designationRoutes);

app.use("/api/innovations", innovationRoutes);
app.use("/api/medmodules", mediaModuleRoues);


app.use("/api", commonRoutes);
app.use("/api", searchRoutes);
app.use('/api/contact', contactRoutes);

if (process.env.NODE_ENV === "production") {

  app.use("/admin", express.static(path.join(__dirname, "view/admin/dist")));
  app.get("/admin/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "view/admin/dist", "index.html"));
  });


  app.use("/", express.static(path.join(__dirname, "view/front/dist")));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "view/front/dist", "index.html"));
  });

} else {
  app.get('/', (req, res) => {
    res.send("Welcome to server");
  })
}

app.listen(process.env.PORT || 3000, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(
      `Server running in production mode on port ${process.env.PORT || 3000}`
    );
    console.log(`Access the admin panel at: ${process.env.BASE_URL}/admin`);

  } else {
    console.log(
      `Server running in development mode on port ${process.env.PORT || 3000}`
    );
    console.log(
      `Access the server at: ${process.env.BASE_URL || "http://localhost:3000"}`
    );
  }
});


