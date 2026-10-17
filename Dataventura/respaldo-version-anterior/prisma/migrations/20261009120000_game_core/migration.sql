-- CreateEnum
CREATE TYPE "SessionKind" AS ENUM ('ISLAND', 'REVIEW');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "LearningWeek" DROP CONSTRAINT "LearningWeek_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Island" DROP CONSTRAINT "Island_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_islandId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_weekId_fkey";

-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_learningObjectiveId_fkey";

-- DropForeignKey
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "LearningSession" DROP CONSTRAINT "LearningSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessionItem" DROP CONSTRAINT "SessionItem_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "SessionItem" DROP CONSTRAINT "SessionItem_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "Assessment" DROP CONSTRAINT "Assessment_userId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentItem" DROP CONSTRAINT "AssessmentItem_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentItem" DROP CONSTRAINT "AssessmentItem_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentObjectiveResult" DROP CONSTRAINT "AssessmentObjectiveResult_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentObjectiveResult" DROP CONSTRAINT "AssessmentObjectiveResult_userId_fkey";

-- DropForeignKey
ALTER TABLE "AssessmentObjectiveResult" DROP CONSTRAINT "AssessmentObjectiveResult_learningObjectiveId_fkey";

-- DropIndex
DROP INDEX "User_role_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "image",
DROP COLUMN "lastSessionDate",
DROP COLUMN "name",
DROP COLUMN "premium",
DROP COLUMN "premiumEndsAt",
DROP COLUMN "premiumStartedAt",
DROP COLUMN "reducedMotion",
DROP COLUMN "registeredAt",
ADD COLUMN     "bestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActiveDay" TEXT;

-- AlterTable
ALTER TABLE "UserIslandProgress" ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "AnalyticsEvent" DROP COLUMN "challengeId",
DROP COLUMN "deviceType",
DROP COLUMN "sessionId";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "LearningRoute";

-- DropTable
DROP TABLE "LearningWeek";

-- DropTable
DROP TABLE "LearningObjective";

-- DropTable
DROP TABLE "Island";

-- DropTable
DROP TABLE "Module";

-- DropTable
DROP TABLE "Challenge";

-- DropTable
DROP TABLE "UserProgress";

-- DropTable
DROP TABLE "LearningSession";

-- DropTable
DROP TABLE "SessionItem";

-- DropTable
DROP TABLE "Achievement";

-- DropTable
DROP TABLE "UserAchievement";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "Assessment";

-- DropTable
DROP TABLE "AssessmentItem";

-- DropTable
DROP TABLE "AssessmentObjectiveResult";

-- DropTable
DROP TABLE "CaptainDialogue";

-- DropEnum
DROP TYPE "ChallengeType";

-- DropEnum
DROP TYPE "Difficulty";

-- DropEnum
DROP TYPE "ChallengeStatus";

-- DropEnum
DROP TYPE "ProgressStatus";

-- DropEnum
DROP TYPE "SessionType";

-- DropEnum
DROP TYPE "AssessmentType";

-- DropEnum
DROP TYPE "Plan";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "ReviewStatus";

-- CreateTable
CREATE TABLE "UserChallengeProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "wrongStreak" INTEGER NOT NULL DEFAULT 0,
    "firstSolvedAt" TIMESTAMP(3),
    "box" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3),
    "lastAnsweredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserChallengeProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "SessionKind" NOT NULL,
    "islandSlug" TEXT,
    "challengeIds" TEXT[],
    "solvedIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answers" INTEGER NOT NULL DEFAULT 0,
    "misses" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PlaySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "UserChallengeProgress_userId_nextReviewAt_idx" ON "UserChallengeProgress"("userId", "nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserChallengeProgress_userId_challengeId_key" ON "UserChallengeProgress"("userId", "challengeId");

-- CreateIndex
CREATE INDEX "PlaySession_userId_startedAt_idx" ON "PlaySession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "PlaySession_completedAt_idx" ON "PlaySession"("completedAt");

-- AddForeignKey
ALTER TABLE "UserChallengeProgress" ADD CONSTRAINT "UserChallengeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaySession" ADD CONSTRAINT "PlaySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Las islas completadas antes de que existieran las estrellas conservan su logro con una estrella.
UPDATE "UserIslandProgress" SET "stars" = 1 WHERE "completed" = true;
