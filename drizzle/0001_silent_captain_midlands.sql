CREATE TABLE `circuit_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`attachmentName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `circuit_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `circuit_threads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `circuit_threads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `emailVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `circuit_messages_thread_idx` ON `circuit_messages` (`threadId`);--> statement-breakpoint
CREATE INDEX `circuit_messages_user_idx` ON `circuit_messages` (`userId`);--> statement-breakpoint
CREATE INDEX `circuit_threads_user_idx` ON `circuit_threads` (`userId`);