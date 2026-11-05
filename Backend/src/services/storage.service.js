import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const uploadFile = async ({ buffer, fileName, folder="veyro" }) => {
    try {
        const result = await client.files.upload({
            file: await ImageKit.toFile(buffer),
            fileName,
            folder: folder
        })
        return result;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}