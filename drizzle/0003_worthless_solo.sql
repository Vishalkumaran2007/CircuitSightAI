CREATE TABLE `circuit_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`threadId` int NOT NULL,
	`messageId` int,
	`feedbackType` enum('correction','confirmation','clarification') NOT NULL,
	`correctionText` text NOT NULL,
	`evidenceNotes` text,
	`reviewStatus` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
	`sourceCheckNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `circuit_feedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `circuit_feedback_user_idx` ON `circuit_feedback` (`userId`);--> statement-breakpoint
CREATE INDEX `circuit_feedback_thread_idx` ON `circuit_feedback` (`threadId`);