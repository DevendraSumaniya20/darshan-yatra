-- CreateTable
CREATE TABLE `GalleryPhoto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `yatraId` VARCHAR(96) NOT NULL,
    `position` INTEGER NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    `alt` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(120) NOT NULL,
    `credit` VARCHAR(255) NOT NULL,
    `sourceUrl` VARCHAR(512) NOT NULL,

    UNIQUE INDEX `GalleryPhoto_yatraId_position_key`(`yatraId`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GalleryPhoto` ADD CONSTRAINT `GalleryPhoto_yatraId_fkey` FOREIGN KEY (`yatraId`) REFERENCES `Yatra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
