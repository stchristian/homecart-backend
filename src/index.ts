
import dotenv from "dotenv";
dotenv.config();
import App from "./app";

const app = new App();

app.run()
  .then(() => {
    console.log("App started successfully...");
  })
  .catch((err) => {
    console.log("Error when running App... Error message: " + err.message);
  });
