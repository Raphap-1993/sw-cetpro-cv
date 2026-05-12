WITH ordered_programs AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      ORDER BY "position" ASC, "title" ASC, "slug" ASC, id ASC
    ) - 1 AS next_position
  FROM "Program"
)
UPDATE "Program" AS program
SET "position" = ordered_programs.next_position
FROM ordered_programs
WHERE program.id = ordered_programs.id
  AND program."position" <> ordered_programs.next_position;

WITH source_assets AS (
  SELECT
    1 AS priority,
    CONCAT('Programa ', "title") AS "title",
    CONCAT('Imagen referencial del programa ', "title", '.') AS "altText",
    BTRIM("imageUrl") AS "url"
  FROM "Program"
  WHERE "imageUrl" IS NOT NULL
    AND BTRIM("imageUrl") <> ''

  UNION ALL

  SELECT
    2 AS priority,
    COALESCE(
      NULLIF(BTRIM("title"), ''),
      CONCAT('Contenido ', "page", '/', "key")
    ) AS "title",
    COALESCE(
      NULLIF(BTRIM("title"), ''),
      CONCAT('Recurso visual asociado a ', "page", '/', "key", '.')
    ) AS "altText",
    BTRIM("mediaUrl") AS "url"
  FROM "ContentBlock"
  WHERE "mediaUrl" IS NOT NULL
    AND BTRIM("mediaUrl") <> ''
),
ranked_assets AS (
  SELECT DISTINCT ON ("url")
    "title",
    "altText",
    "url"
  FROM source_assets
  ORDER BY "url" ASC, priority ASC, "title" ASC
)
INSERT INTO "MediaAsset" (
  "id",
  "title",
  "altText",
  "url",
  "type",
  "status",
  "createdAt",
  "updatedAt"
)
SELECT
  CONCAT('media_', md5("url")),
  "title",
  "altText",
  "url",
  'IMAGE'::"MediaAssetType",
  'PUBLISHED'::"PublishStatus",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM ranked_assets
ON CONFLICT ("url") DO NOTHING;
