/*
  Warnings:

  - You are about to drop the column `adminId` on the `Room` table. All the data in the column will be lost.
  - Added the required column `username` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "adminId",
ADD COLUMN     "username" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
