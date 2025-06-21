/*
  Warnings:

  - You are about to drop the column `contactN0` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `contactNo` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "contactN0",
ADD COLUMN     "contactNo" TEXT NOT NULL;
