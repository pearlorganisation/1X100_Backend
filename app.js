// import express from "express";

// import cookieParser from "cookie-parser";
// import morgan from "morgan";
// import cors from "cors";
// import dontenv from "dotenv";

// // Create an Express application
// const app = express();



// dontenv.config();

// // Middlewares
// app.use(express.json());
// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "development"
//         ? ["http://localhost:5173", "http://localhost:5174"]
//         : ["https://travel-monk-mern.vercel.app"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed methods
//     credentials: true,
//   })
// );
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use(cookieParser());
// app.use(morgan("dev"));



// app.get("/", (req, res) => {
//   res.status(200).send("API Works!");
//   console.log("This is Home route");
// });


// // Routes declaration





// export { app };