import { randomBytes } from "crypto";

// สร้าง bytes สุ่มขนาด 32 bytes แล้วแปลงเป็น hex string
const token = randomBytes(32).toString('hex');

console.log("Your Token:", token); 










