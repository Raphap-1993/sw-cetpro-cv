CREATE TYPE "MediaAssetSource" AS ENUM ('EXTERNAL_URL', 'LOCAL_UPLOAD');

ALTER TABLE "MediaAsset"
ADD COLUMN "source" "MediaAssetSource" NOT NULL DEFAULT 'EXTERNAL_URL',
ADD COLUMN "storageKey" TEXT;

CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");
