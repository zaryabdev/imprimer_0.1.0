npm install express axios cheerio dotenv mysql
npm install --save-dev @types/express @types/node

https://github.com/planetscale/beam/blob/main/prisma/schema.prisma

Pscale cli commands
pscale --version
pscale login
pscale database create cli-db[database]
pscale database ls
pscale shell cli-db
cli-db/mai>
show tables;

CREATE TABLE `Post` (
`id` int NOT NULL AUTO_INCREMENT,
`title` varchar(255) NOT NULL,
`content` text NOT NULL,
`contentHtml` text NOT NULL,
`hidden` tinyint(1) NOT NULL DEFAULT '0',
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL,
`authorId` varchar(255) NOT NULL,
PRIMARY KEY (`id`),
FULLTEXT KEY `Post_title_content_idx` (`title`,`content`)
);

CREATE TABLE `Backups` (
`id` varchar(255) NOT NULL,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`title` varchar(255) NOT NULL,
`content` text NOT NULL,
`contentHtml` text NOT NULL,
`hidden` tinyint(1) NOT NULL DEFAULT '0',
`authorId` varchar(255) NOT NULL,
PRIMARY KEY (`id`),
FULLTEXT KEY `Post_title_content_idx` (`title`,`content`)
);

show tables;

describe Post[table];

pscale branch list cli-db
pscale branch promote cli-db main

ALTER TABLE Post
ADD tag varchar(255);

pscale deploy-request create cli-db dev
pscale deploy-request ls cli-db
pscale deploy-request deploy cli-db 1

INSERT INTO Characters (id, name, species, image) values (1, "Zaryab", "Developer", "image.png");

pscale connect tog dev --execute 'npm run dev';
