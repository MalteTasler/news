CREATE VIEW [dbo].[viNewsEntries]
	AS SELECT Id, Title, Message, TappId, IsHidden, LastModificationTime, PublishTime 
	FROM [NewsEntries] 
	WHERE [NewsEntries].DeletionTime IS null