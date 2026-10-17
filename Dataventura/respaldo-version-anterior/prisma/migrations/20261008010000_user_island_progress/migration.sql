CREATE TABLE "UserIslandProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "islandSlug" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserIslandProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserIslandProgress_userId_islandSlug_key" ON "UserIslandProgress"("userId", "islandSlug");
CREATE INDEX "UserIslandProgress_userId_completed_idx" ON "UserIslandProgress"("userId", "completed");

ALTER TABLE "UserIslandProgress"
ADD CONSTRAINT "UserIslandProgress_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
