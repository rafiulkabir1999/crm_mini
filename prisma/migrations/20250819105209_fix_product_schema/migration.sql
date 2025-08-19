/*
  Warnings:

  - A unique constraint covering the columns `[packageId,productId]` on the table `PackageProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `PackageProduct` DROP FOREIGN KEY `PackageProduct_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `PackageProduct` DROP FOREIGN KEY `PackageProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductImage` DROP FOREIGN KEY `ProductImage_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_productId_fkey`;

-- DropIndex
DROP INDEX `PackageProduct_packageId_fkey` ON `PackageProduct`;

-- DropIndex
DROP INDEX `PackageProduct_productId_fkey` ON `PackageProduct`;

-- DropIndex
DROP INDEX `ProductImage_productId_fkey` ON `ProductImage`;

-- DropIndex
DROP INDEX `Review_packageId_fkey` ON `Review`;

-- DropIndex
DROP INDEX `Review_productId_fkey` ON `Review`;

-- CreateIndex
CREATE UNIQUE INDEX `PackageProduct_packageId_productId_key` ON `PackageProduct`(`packageId`, `productId`);

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageProduct` ADD CONSTRAINT `PackageProduct_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PackageProduct` ADD CONSTRAINT `PackageProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
