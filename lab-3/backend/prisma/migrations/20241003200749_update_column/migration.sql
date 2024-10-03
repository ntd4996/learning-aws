/*
  Warnings:

  - The primary key for the `Column` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Column` table. All the data in the column will be lost.
  - The `id` column on the `Column` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cards` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_columnId_fkey";

-- AlterTable
ALTER TABLE "Column" DROP CONSTRAINT "Column_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "cards" JSONB NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Column_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Card";
