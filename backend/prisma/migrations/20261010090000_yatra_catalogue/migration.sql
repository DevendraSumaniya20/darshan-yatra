-- CreateTable
CREATE TABLE `Yatra` (
    `id` VARCHAR(96) NOT NULL,
    `slug` VARCHAR(96) NOT NULL,
    `name` VARCHAR(160) NOT NULL,
    `circuit` VARCHAR(32) NOT NULL,
    `summary` TEXT NOT NULL,
    `durationDays` INTEGER NOT NULL,
    `startCity` VARCHAR(64) NOT NULL,
    `endCity` VARCHAR(64) NOT NULL,
    `difficulty` VARCHAR(16) NOT NULL,
    `maxAltitudeM` INTEGER NULL,
    `walkingKm` INTEGER NOT NULL,
    `basePricePaise` INTEGER NOT NULL,
    `seasonStartMonth` TINYINT NOT NULL,
    `seasonEndMonth` TINYINT NOT NULL,
    `places` JSON NOT NULL,
    `inclusions` JSON NOT NULL,
    `exclusions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Yatra_slug_key`(`slug`),
    INDEX `Yatra_circuit_idx`(`circuit`),
    INDEX `Yatra_startCity_idx`(`startCity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItineraryDay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `yatraId` VARCHAR(96) NOT NULL,
    `day` INTEGER NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `description` TEXT NOT NULL,
    `overnight` VARCHAR(64) NULL,

    UNIQUE INDEX `ItineraryDay_yatraId_day_key`(`yatraId`, `day`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departure` (
    `id` VARCHAR(128) NOT NULL,
    `yatraId` VARCHAR(96) NOT NULL,
    `startDate` DATE NOT NULL,
    `seatsTotal` INTEGER NOT NULL,
    `seatsBooked` INTEGER NOT NULL DEFAULT 0,
    `pricePaise` INTEGER NOT NULL,

    INDEX `Departure_yatraId_startDate_idx`(`yatraId`, `startDate`),
    INDEX `Departure_startDate_idx`(`startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ItineraryDay` ADD CONSTRAINT `ItineraryDay_yatraId_fkey` FOREIGN KEY (`yatraId`) REFERENCES `Yatra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Departure` ADD CONSTRAINT `Departure_yatraId_fkey` FOREIGN KEY (`yatraId`) REFERENCES `Yatra`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

