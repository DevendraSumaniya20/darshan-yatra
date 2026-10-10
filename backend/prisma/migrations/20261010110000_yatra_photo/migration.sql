-- AlterTable
ALTER TABLE `Yatra` ADD COLUMN `photoPath` VARCHAR(255) NULL,
    ADD COLUMN `photoAlt` VARCHAR(255) NULL,
    ADD COLUMN `photoCredit` VARCHAR(255) NULL,
    ADD COLUMN `photoSourceUrl` VARCHAR(512) NULL;
