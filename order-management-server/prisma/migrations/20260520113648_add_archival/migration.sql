-- CreateTable
CREATE TABLE "OrderArchive" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItemArchive" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "orderArchiveId" TEXT NOT NULL,

    CONSTRAINT "OrderItemArchive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderArchive_store_id_idx" ON "OrderArchive"("store_id");

-- CreateIndex
CREATE INDEX "OrderArchive_created_at_idx" ON "OrderArchive"("created_at");

-- AddForeignKey
ALTER TABLE "OrderItemArchive" ADD CONSTRAINT "OrderItemArchive_orderArchiveId_fkey" FOREIGN KEY ("orderArchiveId") REFERENCES "OrderArchive"("id") ON DELETE CASCADE ON UPDATE CASCADE;
