CREATE TABLE [dbo].[NewsEntries]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Title] nvarchar(255),
	[Message] nvarchar(MAX),
	[TappId] bigint,
	[IsHidden] bit,
	[LastModificationTime] DATETIME2(3),
	[PublishTime] DATETIME2(3),
	[DeletionTime] DATETIME2(3),
	[DeletedByPersonId] varchar
)