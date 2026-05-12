ALTER TABLE "Program"
ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

WITH ordered_programs AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, id ASC) - 1 AS next_position
  FROM "Program"
)
UPDATE "Program" AS program
SET "position" = ordered_programs.next_position
FROM ordered_programs
WHERE program.id = ordered_programs.id;

CREATE INDEX "Program_status_position_idx" ON "Program"("status", "position");
