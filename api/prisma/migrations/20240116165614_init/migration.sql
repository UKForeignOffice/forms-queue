-- CreateTable
CREATE TABLE "reference" (
    "id" SERIAL NOT NULL,
    "job_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reference_job_id_key" ON "reference"("job_id");

-- CreateIndex
CREATE INDEX "reference_job_id_idx" ON "reference"("job_id");
