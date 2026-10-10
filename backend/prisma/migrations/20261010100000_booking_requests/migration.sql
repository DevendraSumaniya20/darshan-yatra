-- CreateTable
CREATE TABLE `BookingRequest` (
    `id` VARCHAR(36) NOT NULL,
    `reference` VARCHAR(12) NOT NULL,
    `departureId` VARCHAR(128) NOT NULL,
    `contactName` VARCHAR(120) NOT NULL,
    `phone` VARCHAR(16) NOT NULL,
    `email` VARCHAR(190) NULL,
    `travellers` INTEGER NOT NULL,
    `note` TEXT NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'pending',
    `totalPaise` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BookingRequest_reference_key`(`reference`),
    INDEX `BookingRequest_departureId_idx`(`departureId`),
    INDEX `BookingRequest_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookingRequest` ADD CONSTRAINT `BookingRequest_departureId_fkey` FOREIGN KEY (`departureId`) REFERENCES `Departure`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

