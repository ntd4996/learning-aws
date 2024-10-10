/*
  Warnings:

  - You are about to drop the column `imageBackground` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageBackground",
ADD COLUMN     "imageBackgroundId" TEXT;

-- CreateTable
CREATE TABLE "ImageBackground" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageBackground_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_imageBackgroundId_fkey" FOREIGN KEY ("imageBackgroundId") REFERENCES "ImageBackground"("id") ON DELETE SET NULL ON UPDATE CASCADE;
