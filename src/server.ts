import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  readLocalFiles,
} from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredimage", async (req: Request, res: Response) => {
    if (!req.query.image_url) {
      return res.json({ error: "No image url in query parameter" }).status(400);
    }
    try {
      const imagePath: string = await filterImageFromURL(
        req.query["image_url"] as string
      );

      res.status(200).sendFile(imagePath);
      const imageFiles: string[] = await readLocalFiles();

      await deleteLocalFiles(imageFiles);
    } catch (error) {
      return res.json({ error }).status(422);
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
