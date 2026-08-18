CREATE TABLE `idk_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`explanationLevel` enum('beginner','intermediate','advanced') NOT NULL DEFAULT 'intermediate',
	`responseStyle` enum('concise','balanced','detailed') NOT NULL DEFAULT 'balanced',
	`sarcasmEnabled` boolean NOT NULL DEFAULT false,
	`technicalTerminology` boolean NOT NULL DEFAULT true,
	`preferVisuals` boolean NOT NULL DEFAULT true,
	`suggestImprovements` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `idk_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `idk_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE INDEX `idk_preferences_user_idx` ON `idk_preferences` (`userId`);