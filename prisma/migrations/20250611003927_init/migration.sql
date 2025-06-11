-- CreateTable
CREATE TABLE `TipoMedic` (
    `CodTipoMed` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`CodTipoMed`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Especialidad` (
    `CodEspec` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcionEsp` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`CodEspec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Laboratorio` (
    `CodLab` INTEGER NOT NULL AUTO_INCREMENT,
    `razonSocial` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `contacto` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`CodLab`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicamento` (
    `CodMedicamento` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcionMed` VARCHAR(191) NOT NULL,
    `fechaFabricacion` DATETIME(3) NOT NULL,
    `fechaVencimiento` DATETIME(3) NOT NULL,
    `presentacion` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `precioVentaUni` DOUBLE NOT NULL,
    `precioVentaPres` DOUBLE NOT NULL,
    `CodTipoMed` INTEGER NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `CodEspec` INTEGER NOT NULL,

    PRIMARY KEY (`CodMedicamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenVenta` (
    `NroOrdenVta` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaEmision` DATETIME(3) NOT NULL,
    `motivo` VARCHAR(191) NOT NULL,
    `situacion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`NroOrdenVta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleOrdenVta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NroOrdenVta` INTEGER NOT NULL,
    `CodMedicamento` INTEGER NOT NULL,
    `descripcionMed` VARCHAR(191) NOT NULL,
    `cantidadRequerida` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrdenCompra` (
    `NroOrdenC` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaEmision` DATETIME(3) NOT NULL,
    `situacion` VARCHAR(191) NOT NULL,
    `total` DOUBLE NOT NULL,
    `CodLab` INTEGER NOT NULL,
    `NrofacturaProv` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`NroOrdenC`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetalleOrdenCompra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NroOrdenC` INTEGER NOT NULL,
    `CodMedicamento` INTEGER NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio` DOUBLE NOT NULL,
    `montouni` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Medicamento` ADD CONSTRAINT `Medicamento_CodTipoMed_fkey` FOREIGN KEY (`CodTipoMed`) REFERENCES `TipoMedic`(`CodTipoMed`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicamento` ADD CONSTRAINT `Medicamento_CodEspec_fkey` FOREIGN KEY (`CodEspec`) REFERENCES `Especialidad`(`CodEspec`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenVta` ADD CONSTRAINT `DetalleOrdenVta_NroOrdenVta_fkey` FOREIGN KEY (`NroOrdenVta`) REFERENCES `OrdenVenta`(`NroOrdenVta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenVta` ADD CONSTRAINT `DetalleOrdenVta_CodMedicamento_fkey` FOREIGN KEY (`CodMedicamento`) REFERENCES `Medicamento`(`CodMedicamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrdenCompra` ADD CONSTRAINT `OrdenCompra_CodLab_fkey` FOREIGN KEY (`CodLab`) REFERENCES `Laboratorio`(`CodLab`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenCompra` ADD CONSTRAINT `DetalleOrdenCompra_NroOrdenC_fkey` FOREIGN KEY (`NroOrdenC`) REFERENCES `OrdenCompra`(`NroOrdenC`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetalleOrdenCompra` ADD CONSTRAINT `DetalleOrdenCompra_CodMedicamento_fkey` FOREIGN KEY (`CodMedicamento`) REFERENCES `Medicamento`(`CodMedicamento`) ON DELETE RESTRICT ON UPDATE CASCADE;
