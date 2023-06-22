CREATE TABLE [dbo].[Image]
(
	[Id] INT NOT NULL PRIMARY KEY,
	[Url] varchar,
	[NewsEntryId] INT NOT NULL FOREIGN KEY REFERENCES NewsEntries(Id)
)