CREATE TABLE `pixels` (
	`x` integer NOT NULL,
	`y` integer NOT NULL,
	`color` text NOT NULL,
	PRIMARY KEY(`x`, `y`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`name` text PRIMARY KEY NOT NULL,
	`lastHeartBeat` text NOT NULL,
	`createdAt` text NOT NULL
);
