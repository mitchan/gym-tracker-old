/*
  Warnings:

  - You are about to drop the column `trainingId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_trainingId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "trainingId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ExercicesOnTraining" (
    "trainingId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "ExercicesOnTraining_pkey" PRIMARY KEY ("trainingId","exerciseId")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercicesOnTraining" ADD CONSTRAINT "ExercicesOnTraining_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercicesOnTraining" ADD CONSTRAINT "ExercicesOnTraining_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
