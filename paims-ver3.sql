CREATE DATABASE  IF NOT EXISTS `paims` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `paims`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: paims
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `item_category`
--

DROP TABLE IF EXISTS `item_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_category` (
  `CategoryID` int NOT NULL,
  `CategoryName` varchar(15) NOT NULL,
  `Category_Desc` text,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `CategoryName_UNIQUE` (`CategoryName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_category`
--

LOCK TABLES `item_category` WRITE;
/*!40000 ALTER TABLE `item_category` DISABLE KEYS */;
INSERT INTO `item_category` VALUES (1,'Mouse','Mouse'),(2,'Keyboard','USB Keyboard'),(3,'Fan','Electrical Fan'),(4,'Chair','Chair'),(5,'Table','Table'),(6,'Laptop','Laptop'),(7,'PC','PC'),(8,'Cord','Extension Cord'),(9,'AC','Air Conditioner');
/*!40000 ALTER TABLE `item_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_document`
--

DROP TABLE IF EXISTS `item_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_document` (
  `DocumentID` varchar(20) NOT NULL,
  `DocumentType` varchar(20) DEFAULT NULL,
  `DateIssued` date DEFAULT NULL,
  `IssuedBy` varchar(25) NOT NULL,
  `ReceivedBy` varchar(25) NOT NULL,
  `Link` text,
  PRIMARY KEY (`DocumentID`),
  KEY `ReceivedBy_idx` (`ReceivedBy`),
  KEY `IssuedBy_idx` (`IssuedBy`),
  CONSTRAINT `IssuedBy` FOREIGN KEY (`IssuedBy`) REFERENCES `user` (`Username`),
  CONSTRAINT `ReceivedBy` FOREIGN KEY (`ReceivedBy`) REFERENCES `user` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_document`
--

LOCK TABLES `item_document` WRITE;
/*!40000 ALTER TABLE `item_document` DISABLE KEYS */;
INSERT INTO `item_document` VALUES ('IRRUP-2022-020','IRRUP','2022-03-05','jjvdcs','pcndcs','https://test.com');
/*!40000 ALTER TABLE `item_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_location`
--

DROP TABLE IF EXISTS `item_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_location` (
  `LocationID` int NOT NULL,
  `Building` varchar(10) DEFAULT NULL,
  `RoomNumber` int DEFAULT NULL,
  PRIMARY KEY (`LocationID`),
  UNIQUE KEY `Building_UNIQUE` (`Building`,`RoomNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_location`
--

LOCK TABLES `item_location` WRITE;
/*!40000 ALTER TABLE `item_location` DISABLE KEYS */;
INSERT INTO `item_location` VALUES (1,'AECH',203),(2,'AECH',204),(3,'AECH',205),(4,'AECH',301),(5,'AECH',302),(6,'Storage',0);
/*!40000 ALTER TABLE `item_location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property` (
  `PropertyID` int NOT NULL,
  `PropertyName` varchar(20) NOT NULL,
  `StatusID` int NOT NULL,
  `PropertySupervisorID` int NOT NULL,
  `SupplierID` int NOT NULL,
  `LocationID` int NOT NULL,
  `CategoryID` int NOT NULL,
  `DocumentID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`PropertyID`),
  UNIQUE KEY `PropertyID_UNIQUE` (`PropertyID`),
  KEY `ItemCategoryID_idx` (`CategoryID`),
  KEY `StatusID_idx` (`StatusID`),
  KEY `LocationID_idx` (`LocationID`),
  KEY `PropertySupervisorID_idx` (`PropertySupervisorID`),
  KEY `SupplierID_idx` (`SupplierID`),
  KEY `DocumentID_idx` (`DocumentID`),
  CONSTRAINT `DocumentID` FOREIGN KEY (`DocumentID`) REFERENCES `item_document` (`DocumentID`),
  CONSTRAINT `ItemCategoryID` FOREIGN KEY (`CategoryID`) REFERENCES `item_category` (`CategoryID`),
  CONSTRAINT `LocationID` FOREIGN KEY (`LocationID`) REFERENCES `item_location` (`LocationID`),
  CONSTRAINT `PropertySupervisorID` FOREIGN KEY (`PropertySupervisorID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `StatusID` FOREIGN KEY (`StatusID`) REFERENCES `status` (`StatusID`),
  CONSTRAINT `SupplierID` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`SupplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property`
--

LOCK TABLES `property` WRITE;
/*!40000 ALTER TABLE `property` DISABLE KEYS */;
INSERT INTO `property` VALUES (318530,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020'),(318531,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020'),(318532,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020'),(318533,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020'),(318534,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020'),(318535,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020'),(318536,'Chair Conference',1,2,40213,1,4,'IRRUP-2022-020');
/*!40000 ALTER TABLE `property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order`
--

DROP TABLE IF EXISTS `purchase_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order` (
  `PurchaseOrderID` int NOT NULL,
  `PropertyID` int NOT NULL,
  `SupplierID` int NOT NULL,
  `PurchaseDate` date DEFAULT NULL,
  `TotalCost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`PurchaseOrderID`,`PropertyID`),
  KEY `PropertyID_UNIQUE` (`PropertyID`) /*!80000 INVISIBLE */,
  KEY `SupplierID_idx` (`SupplierID`),
  CONSTRAINT `PropertyID_order` FOREIGN KEY (`PropertyID`) REFERENCES `property` (`PropertyID`),
  CONSTRAINT `SupplierID_order` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`SupplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order`
--

LOCK TABLES `purchase_order` WRITE;
/*!40000 ALTER TABLE `purchase_order` DISABLE KEYS */;
INSERT INTO `purchase_order` VALUES (9328,318530,40213,'2022-02-01',2000.00),(9328,318531,40213,'2022-02-01',2000.00),(9328,318532,40213,'2022-02-01',2000.00),(9328,318533,40213,'2022-02-01',2000.00),(9328,318534,40213,'2022-02-01',2000.00),(9328,318535,40213,'2022-02-01',2000.00),(9328,318536,40213,'2022-02-01',2000.00);
/*!40000 ALTER TABLE `purchase_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `StatusID` int NOT NULL,
  `StatusName` varchar(10) NOT NULL,
  `Status_Desc` text,
  PRIMARY KEY (`StatusID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'In use','Currently being used'),(2,'Available','Not used'),(3,'Broken','Broken');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `SupplierID` int NOT NULL,
  `SupplierName` varchar(50) NOT NULL,
  `SupplierContact` varchar(20) DEFAULT NULL,
  `UnitNumber` int DEFAULT NULL,
  `StreetName` varchar(25) DEFAULT NULL,
  `City` varchar(15) DEFAULT NULL,
  `State` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`SupplierID`),
  UNIQUE KEY `SupplierName_UNIQUE` (`SupplierName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (40213,'TestCorp','09161112345',51,'Maharlika St.','Quezon City','NCR');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL,
  `Username` varchar(25) NOT NULL,
  `Password` varchar(25) NOT NULL,
  `FirstName` varchar(15) NOT NULL,
  `LastName` varchar(15) NOT NULL,
  `UserContact` varchar(20) DEFAULT NULL,
  `Role` varchar(10) NOT NULL,
  `Department` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'jjvdcs','pass','John Justine','Villar','09178130291','Admin','DCS'),(2,'pcndcs','pass1','Prospero','Naval','09234447612','Supervisor','DCS');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-02 20:55:43
