/*
  Warnings:

  - Added the required column `claps` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Made the column `image` on table `Blog` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `about` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "claps" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "about" TEXT NOT NULL,
ADD COLUMN     "bookmarks" INTEGER[];
