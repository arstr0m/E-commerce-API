-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "quantity" SET DEFAULT 1;